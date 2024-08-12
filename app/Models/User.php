<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];


    // Relacija: Jedan korisnik može imati više planova trčanja
    public function runPlans()
    {
        return $this->hasMany(RunPlan::class);
    }

    // Relacija: Jedan korisnik može biti učesnik u više trčanja
    public function runParticipants()
    {
        return $this->hasMany(RunParticipant::class);
    }

    // Relacija: Jedan korisnik može napisati više komentara
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Relacija: Jedan korisnik ima jednu statistiku
    public function userStats()
    {
        return $this->hasOne(UserStat::class);
    }
    // Relacija: Jedan korisnik ima jednu ulogu
    public function role()
    {
    return $this->belongsTo(Role::class);
    }
}
