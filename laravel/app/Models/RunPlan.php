<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RunPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'location',
        'latitude',
        'longitude',
        'time',
        'distance',
    ];

    // Relacija: Plan trčanja pripada korisniku
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relacija: Plan trčanja može imati više učesnika
    public function participants()
    {
        return $this->hasMany(RunParticipant::class);
    }

    // Relacija: Plan trčanja može imati više komentara
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
