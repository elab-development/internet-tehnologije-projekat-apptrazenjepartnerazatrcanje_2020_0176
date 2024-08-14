<?php

namespace App\Http\Controllers;

use App\Models\RunParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\RunParticipantResource;

class RunParticipantController extends Controller
{
    // Fetch all run participants
    public function index()
    {
        $runParticipants = RunParticipant::all();
        return RunParticipantResource::collection($runParticipants);
    }

    // Fetch a single run participant by ID
    public function show($id)
    {
        $runParticipant = RunParticipant::findOrFail($id);
        return new RunParticipantResource($runParticipant);
    }

    // Create a new run participant
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'run_plan_id' => 'required|exists:run_plans,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $runParticipant = RunParticipant::create([
            'run_plan_id' => $request->run_plan_id,
            'user_id' => auth()->id(), // Get the logged-in user's ID
        ]);

        return new RunParticipantResource($runParticipant);
    }

    // Update an existing run participant
    public function update(Request $request, $id)
    {
        $runParticipant = RunParticipant::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'run_plan_id' => 'required|exists:run_plans,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $runParticipant->update([
            'run_plan_id' => $request->run_plan_id,
        ]);

        return new RunParticipantResource($runParticipant);
    }

    // Delete a run participant
    public function destroy($id)
    {
        $runParticipant = RunParticipant::findOrFail($id);
        $runParticipant->delete();

        return response()->json(null, 204);
    }
}
