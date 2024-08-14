<?php

namespace App\Http\Controllers;

use App\Models\RunPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\RunPlanResource;

class RunPlanController extends Controller
{
    // Fetch all run plans
    public function index()
    {
        $runPlans = RunPlan::all();
        return RunPlanResource::collection($runPlans);
    }

    // Fetch a single run plan by ID
    public function show($id)
    {
        $runPlan = RunPlan::findOrFail($id);
        return new RunPlanResource($runPlan);
    }

    // Create a new run plan
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'location' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'time' => 'required|date_format:Y-m-d H:i:s',
            'distance' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $runPlan = RunPlan::create([
            'user_id' => auth()->id(), // Get the logged-in user's ID
            'location' => $request->location,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'time' => $request->time,
            'distance' => $request->distance,
        ]);

        return new RunPlanResource($runPlan);
    }

    // Update an existing run plan
    public function update(Request $request, $id)
    {
        $runPlan = RunPlan::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'location' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'time' => 'required|date_format:Y-m-d H:i:s',
            'distance' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $runPlan->update([
            'location' => $request->location,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'time' => $request->time,
            'distance' => $request->distance,
        ]);

        return new RunPlanResource($runPlan);
    }

    // Delete a run plan
    public function destroy($id)
    {
        $runPlan = RunPlan::findOrFail($id);
        $runPlan->delete();

        return response()->json(null, 204);
    }
}
