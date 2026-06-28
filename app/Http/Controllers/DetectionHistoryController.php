<?php

namespace App\Http\Controllers;

use App\Models\DetectionHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DetectionHistoryController extends Controller
{
    public function index()
    {
        $histories = Auth::user()->detectionHistories()->latest()->get();

        return inertia('Histories/Index', [
            'histories' => $histories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'predicted_class'  => 'required|string|max:255',
            'confidence'       => 'required|numeric|between:0,100',
            'severity_percent' => 'required|numeric|between:0,100',
            'image'            => 'nullable|image|max:5120', // Max 5MB
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('detections', 'public');
        }

        Auth::user()->detectionHistories()->create($validated);

        return redirect()->back()->with('success', 'Riwayat deteksi berhasil disimpan.');
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array|min:1',
            'ids.*' => 'integer',
        ]);

        $histories = Auth::user()->detectionHistories()->whereIn('id', $validated['ids'])->get();
        foreach ($histories as $history) {
            if ($history->image_path) {
                Storage::disk('public')->delete($history->image_path);
            }
            $history->delete();
        }

        return redirect()->back()->with('success', count($validated['ids']) . ' riwayat deteksi berhasil dihapus.');
    }

    public function update(Request $request, DetectionHistory $history)
    {
        abort_unless($history->user_id === Auth::id(), 403);

        $validated = $request->validate([
            'predicted_class'  => 'required|string|max:255',
            'confidence'       => 'required|numeric|between:0,100',
            'severity_percent' => 'required|numeric|between:0,100',
            'image'            => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($history->image_path) {
                Storage::disk('public')->delete($history->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('detections', 'public');
        }

        $history->update($validated);

        return redirect()->back()->with('success', 'Riwayat deteksi berhasil diperbarui.');
    }

    public function destroy(DetectionHistory $history)
    {
        abort_unless($history->user_id === Auth::id(), 403);

        if ($history->image_path) {
            Storage::disk('public')->delete($history->image_path);
        }

        $history->delete();

        return redirect()->back()->with('success', 'Riwayat deteksi berhasil dihapus.');
    }
}
