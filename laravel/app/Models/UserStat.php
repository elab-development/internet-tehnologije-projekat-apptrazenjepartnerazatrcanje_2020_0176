<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_distance',
        'total_runs',
    ];

 
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
