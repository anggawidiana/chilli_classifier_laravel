<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetectionHistory extends Model
{
    protected $fillable = [
        'user_id',
        'predicted_class',
        'confidence',
        'severity_percent',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
