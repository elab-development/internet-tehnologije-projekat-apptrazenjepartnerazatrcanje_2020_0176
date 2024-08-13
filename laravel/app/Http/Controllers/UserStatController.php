<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserStatResource;
use App\Models\UserStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserStatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userStats = UserStat::all();
        return UserStatResource::collection($userStats);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'total_distance' => 'required|numeric|min:0',
            'total_runs' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $userStat = UserStat::create($request->all());

        return new UserStatResource($userStat);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $userStat = UserStat::findOrFail($id);
        return new UserStatResource($userStat);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $userStat = UserStat::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'total_distance' => 'required|numeric|min:0',
            'total_runs' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $userStat->update($request->all());

        return new UserStatResource($userStat);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $userStat = UserStat::findOrFail($id);
        $userStat->delete();

        return response()->json(['message' => 'UserStat deleted successfully']);
    }
}
