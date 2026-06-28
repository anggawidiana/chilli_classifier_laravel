<?php

namespace App\Http\Controllers;

use App\Models\DetectionHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
        ]);

        Auth::user()->detectionHistories()->create($validated);

        return redirect()->back()->with('success', 'Riwayat deteksi berhasil disimpan.');
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array|min:1',
            'ids.*' => 'integer',
        ]);

        Auth::user()->detectionHistories()->whereIn('id', $validated['ids'])->delete();

        return redirect()->back()->with('success', count($validated['ids']) . ' riwayat deteksi berhasil dihapus.');
    }

    public function update(Request $request, DetectionHistory $history)
    {
        abort_unless($history->user_id === Auth::id(), 403);

        $validated = $request->validate([
            'predicted_class'  => 'required|string|max:255',
            'confidence'       => 'required|numeric|between:0,100',
            'severity_percent' => 'required|numeric|between:0,100',
        ]);

        $history->update($validated);

        return redirect()->back()->with('success', 'Riwayat deteksi berhasil diperbarui.');
    }

    public function destroy(DetectionHistory $history)
    {
        abort_unless($history->user_id === Auth::id(), 403);

        $history->delete();

        return redirect()->back()->with('success', 'Riwayat deteksi berhasil dihapus.');
    }
}
