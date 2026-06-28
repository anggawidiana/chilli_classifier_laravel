<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetectionHistory extends Model
{
    protected $fillable = [
        'predicted_class',
        'confidence',
        'severity_percent',
    ];
}
