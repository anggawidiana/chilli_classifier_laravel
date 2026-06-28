<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class DetectionController extends Controller
{
    public function index()
    {
        return inertia('Detection/Index', [
            'histories' => Auth::user()->detectionHistories()->latest()->get(),
        ]);
    }
}
