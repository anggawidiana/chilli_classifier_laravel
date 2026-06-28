<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DetectionHistoryController;



Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::inertia('/detection', 'Detection/Index')->name('detection.index');
    Route::get('/histories', [DetectionHistoryController::class, 'index'])->name('histories.index');
    Route::post('/histories', [DetectionHistoryController::class, 'store'])->name('histories.store');
    Route::patch('/histories/{history}', [DetectionHistoryController::class, 'update'])->name('histories.update');
    Route::delete('/histories/{history}', [DetectionHistoryController::class, 'destroy'])->name('histories.destroy');
});

require __DIR__.'/settings.php';
