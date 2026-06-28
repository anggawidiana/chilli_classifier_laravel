<?php

namespace App\Http\Controllers;

use App\Models\DetectionHistory;
use Illuminate\Http\Request;

class DetectionHistoryController extends Controller
{
    /**
     * Display a listing of the detection histories.
     */
    public function index()
    {
        $histories = DetectionHistory::latest()->get();

        return inertia('Histories/Index', [
            'histories' => $histories
        ]);
    }

    /**
     * Store a newly created detection history in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'predicted_class'  => 'required|string|max:255',
            'confidence'       => 'required|numeric|between:0,100',
            'severity_percent' => 'required|numeric|between:0,100',
        ]);

        DetectionHistory::create($validated);

        return redirect()->back()->with('success', 'Riwayat deteksi berhasil disimpan.');
    }

    /**
     * Remove multiple detection histories from storage.
     */
    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array|min:1',
            'ids.*' => 'integer|exists:detection_histories,id',
        ]);

        DetectionHistory::whereIn('id', $validated['ids'])->delete();

        return redirect()->back()->with('success', count($validated['ids']) . ' riwayat deteksi berhasil dihapus.');
    }

    /**
     * Update the specified detection history in storage.
     */
    public function update(Request $request, DetectionHistory $history)
    {
        $validated = $request->validate([
            'predicted_class'  => 'required|string|max:255',
            'confidence'       => 'required|numeric|between:0,100',
            'severity_percent' => 'required|numeric|between:0,100',
        ]);

        $history->update($validated);

        return redirect()->back()->with('success', 'Riwayat deteksi berhasil diperbarui.');
    }

    /**
     * Remove the specified detection history from storage.
     */
    public function destroy(DetectionHistory $history)
    {
        $history->delete();

        return redirect()->back()->with('success', 'Riwayat deteksi berhasil dihapus.');
    }
}
