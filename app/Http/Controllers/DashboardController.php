<?php

namespace App\Http\Controllers;

use App\Models\DetectionHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. KPIs
        $totalScans = DetectionHistory::where('user_id', auth()->id())->count();
        $averageConfidence = (DetectionHistory::where('user_id', auth()->id())->avg('confidence') ?? 0) * 100;
        $averageSeverity = DetectionHistory::where('user_id', auth()->id())->where('severity_percent', '>', 0)->avg('severity_percent') ?? 0;

        $mostCommonClassResult = DetectionHistory::where('user_id', auth()->id())
            ->select('predicted_class', DB::raw('count(*) as total'))
            ->groupBy('predicted_class')
            ->orderByDesc('total')
            ->first();
        $mostCommonDisease = $mostCommonClassResult ? $mostCommonClassResult->predicted_class : 'None';

        // 2. Chart Data: Disease Distribution
        $diseaseDistribution = DetectionHistory::where('user_id', auth()->id())
            ->select('predicted_class as name', DB::raw('count(*) as value'))
            ->groupBy('predicted_class')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'value' => (int) $item->value
                ];
            });

        // 3. Chart Data: Recent Activity (Last 7 Days)
        $recentActivityRaw = DetectionHistory::where('user_id', auth()->id())
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as scans')
            )
            ->where('created_at', '>=', Carbon::now()->subDays(6)->startOfDay())
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        $recentActivity = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $found = $recentActivityRaw->firstWhere('date', $date);
            $recentActivity->push([
                'date' => Carbon::now()->subDays($i)->format('M d'),
                'scans' => $found ? (int) $found->scans : 0,
            ]);
        }

        // 4. Recent Detections List
        $latestDetections = DetectionHistory::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get()
            ->map(function ($history) {
                return [
                    'id' => $history->id,
                    'predicted_class' => $history->predicted_class,
                    'confidence' => round($history->confidence * 100, 1),
                    'severity_percent' => round($history->severity_percent, 1),
                    'created_at_human' => $history->created_at->diffForHumans(),
                    'created_at_raw' => $history->created_at->format('M d, Y H:i')
                ];
            });

        return Inertia::render('dashboard', [
            'kpis' => [
                'totalScans' => $totalScans,
                'averageConfidence' => round($averageConfidence, 1),
                'averageSeverity' => round($averageSeverity, 1),
                'mostCommonDisease' => $mostCommonDisease,
            ],
            'charts' => [
                'diseaseDistribution' => $diseaseDistribution,
                'recentActivity' => $recentActivity,
            ],
            'latestDetections' => $latestDetections,
        ]);
    }
}
