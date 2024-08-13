<?php

namespace Database\Seeders;

use App\Models\RunParticipant;
use App\Models\RunPlan;
use App\Models\User;
use App\Models\UserStat;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserStatsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Uzmi sve korisnike iz baze
        $users = User::all();

        foreach ($users as $user) {
            // Izračunaj ukupnu distancu za trke koje je korisnik organizovao
            $ownDistance = RunPlan::where('user_id', $user->id)->sum('distance');

            // Izračunaj ukupnu distancu za trke u kojima je korisnik učestvovao kao participant
            $participantDistance = RunParticipant::where('user_id', $user->id)
                ->join('run_plans', 'run_participants.run_plan_id', '=', 'run_plans.id')
                ->sum('run_plans.distance');

            // Saberi distancu iz oba izvora
            $totalDistance = $ownDistance + $participantDistance;

            // Broj učešća u trkama
            $totalRuns = RunParticipant::where('user_id', $user->id)->count();

            // Kreiraj ili ažuriraj UserStats za ovog korisnika
            UserStat::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'total_distance' => $totalDistance,
                    'total_runs' => $totalRuns,
                ]
            );
        }

    }
}
