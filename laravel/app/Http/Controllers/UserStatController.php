<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserStatResource;
use App\Models\UserStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UserStatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userStats = UserStat::where('user_id', auth()->id())->get();
        return UserStatResource::collection($userStats);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'total_distance' => 'required|numeric|min:0',
            'total_runs' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $userStat = UserStat::create([
            'user_id' => auth()->id(), // Automatski dodeljuje ID ulogovanog korisnika
            'total_distance' => $request->total_distance,
            'total_runs' => $request->total_runs,
        ]);

        return new UserStatResource($userStat);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $userStat = UserStat::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return new UserStatResource($userStat);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $userStat = UserStat::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'total_distance' => 'required|numeric|min:0',
            'total_runs' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $userStat->update([
            'total_distance' => $request->total_distance,
            'total_runs' => $request->total_runs,
        ]);

        return new UserStatResource($userStat);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $userStat = UserStat::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $userStat->delete();

        return response()->json(['message' => 'UserStat deleted successfully']);
    }

    public function getAggregatedStats()
    {
        // Calculate the average total distance and total runs for all users
        $averageStats = UserStat::select(
            DB::raw('AVG(total_distance) as avg_distance'),
            DB::raw('AVG(total_runs) as avg_runs')
        )->first();

        // Get the highest total distance and total runs among all users
        $maxStats = UserStat::select(
            DB::raw('MAX(total_distance) as max_distance'),
            DB::raw('MAX(total_runs) as max_runs')
        )->first();

        return response()->json([
            'average_distance' => $averageStats->avg_distance,
            'average_runs' => $averageStats->avg_runs,
            'max_distance' => $maxStats->max_distance,
            'max_runs' => $maxStats->max_runs,
        ]);
    }
}
