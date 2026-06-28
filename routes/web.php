<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DetectionHistoryController;



Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('/detection', 'Detection/Index')->name('detection.index');
    Route::get('/histories', [DetectionHistoryController::class, 'index'])->name('histories.index');
    Route::post('/histories', [DetectionHistoryController::class, 'store'])->name('histories.store');
});

require __DIR__.'/settings.php';
