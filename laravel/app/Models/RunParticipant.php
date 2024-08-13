<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RunParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'run_plan_id',
        'user_id',
    ];

    // Relacija: Učesnik pripada planu trčanja
    public function runPlan()
    {
        return $this->belongsTo(RunPlan::class);
    }

    // Relacija: Učesnik pripada korisniku
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
