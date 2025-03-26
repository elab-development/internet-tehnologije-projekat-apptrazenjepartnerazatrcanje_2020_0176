<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::table('roles')->insert([
            ['name' => 'Admin'],
            ['name' => 'Ulogovan'],
            ['name' => 'Neulogovan'],
        ]);
        
        User::factory(10)->create();

        
        (new RunPlansSeeder())->run();
        (new CommentsSeeder())->run();
        (new RunParticipantSeeder())->run();
        //(new UserStatsSeeder())->run();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
