<?php

namespace App\Http\Controllers;

use App\Models\RunPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\RunPlanResource;
use App\Models\Comment;
use App\Models\RunParticipant;
use Illuminate\Support\Facades\DB;

class RunPlanController extends Controller
{
    // Fetch all run plans
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10); // Po defaultu, prikazujemo 10 planova po stranici
        $runPlans = RunPlan::paginate($perPage);
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
        DB::beginTransaction();

        try {
            $runPlan = RunPlan::findOrFail($id);

            // Brisanje svih komentara povezanih sa planom trčanja
            Comment::where('run_plan_id', $runPlan->id)->delete();

            // Brisanje svih učesnika povezanih sa planom trčanja
            RunParticipant::where('run_plan_id', $runPlan->id)->delete();

            // Brisanje samog plana trčanja
            $runPlan->delete();

            DB::commit();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'An error occurred while deleting the run plan.'], 500);
        }
    }

      // Advanced search for run plans
      public function search(Request $request)
      {
          $query = RunPlan::query();
  
          if ($request->has('location')) {
              $query->where('location', 'LIKE', '%' . $request->location . '%');
          }
  
          if ($request->has('latitude')) {
              $query->where('latitude', $request->latitude);
          }
  
          if ($request->has('longitude')) {
              $query->where('longitude', $request->longitude);
          }
  
          if ($request->has('time')) {
              $query->where('time', $request->time);
          }
  
          if ($request->has('distance')) {
              $query->where('distance', $request->distance);
          }
  
          if ($request->has('user_id')) {
              $query->where('user_id', $request->user_id);
          }
  
          $runPlans = $query->get();
  
          return RunPlanResource::collection($runPlans);
      }

      
      // Fetch all run plans where a specific user has participated
    public function getUserRunPlans($userId)
    {
        // Get all run plan IDs where the user is a participant
        $runPlanIds = RunParticipant::where('user_id', $userId)->pluck('run_plan_id');

        // Fetch the run plans using the IDs
        $runPlans = RunPlan::whereIn('id', $runPlanIds)->get();

        return RunPlanResource::collection($runPlans);
    }
}
