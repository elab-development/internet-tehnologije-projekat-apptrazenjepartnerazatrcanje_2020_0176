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
        // Validacija ulaznih podataka
        $validator = Validator::make($request->all(), [
            'run_plan_id' => 'required|exists:run_plans,id',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        // Provera da li je korisnik već prijavljen za ovu trku
        $existingParticipant = RunParticipant::where('run_plan_id', $request->run_plan_id)
            ->where('user_id', auth()->id())
            ->first();
    
        if ($existingParticipant) {
            return response()->json(['error' => 'You have already joined this run plan.'], 409);
        }
    
        // Kreiranje novog učesnika trke
        $runParticipant = RunParticipant::create([
            'run_plan_id' => $request->run_plan_id,
            'user_id' => auth()->id(), // Dohvata ID trenutno ulogovanog korisnika
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

     // Fetch all run participants with sorting
     public function sort(Request $request)
     {
         $validator = Validator::make($request->all(), [
             'sort_by' => 'required|string|in:run_plan_id,user_id,created_at,updated_at', // Specify the allowed columns for sorting
             'order' => 'required|string|in:asc,desc', // Specify the allowed order types
         ]);
 
         if ($validator->fails()) {
             return response()->json(['errors' => $validator->errors()], 422);
         }
 
         $runParticipants = RunParticipant::orderBy($request->sort_by, $request->order)->get();
         return RunParticipantResource::collection($runParticipants);
     }

}
