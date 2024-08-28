<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\RunPlan;
use App\Models\Comment;
use App\Models\RunParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get overall statistics for the admin dashboard.
     */
    public function getStatistics()
    {
        // Broj svih korisnika
        $totalUsers = User::count();

        // Broj planova trčanja
        $totalRunPlans = RunPlan::count();

        // Broj komentara
        $totalComments = Comment::count();

        // Broj učesnika u trkama
        $totalRunParticipants = RunParticipant::count();

        // Najviše korišćena lokacija (primer)
        $mostUsedLocation = RunPlan::select('location', DB::raw('count(*) as total'))
            ->groupBy('location')
            ->orderBy('total', 'desc')
            ->first();

        // Najaktivniji korisnik po broju planova trčanja
        $mostActiveUser = User::withCount('runPlans')
            ->orderBy('run_plans_count', 'desc')
            ->first();

        // Broj novih korisnika u poslednjih 30 dana
        $newUsersLast30Days = User::where('created_at', '>=', now()->subDays(30))->count();

        // Povratak svih statistika kao JSON
        return response()->json([
            'total_users' => $totalUsers,
            'total_run_plans' => $totalRunPlans,
            'total_comments' => $totalComments,
            'total_run_participants' => $totalRunParticipants,
            'most_used_location' => $mostUsedLocation ? $mostUsedLocation->location : null,
            'most_active_user' => $mostActiveUser ? $mostActiveUser->name : null,
            'new_users_last_30_days' => $newUsersLast30Days,
        ]);
    }
}
