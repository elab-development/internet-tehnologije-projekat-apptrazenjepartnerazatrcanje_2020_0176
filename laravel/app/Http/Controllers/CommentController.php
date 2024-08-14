<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\CommentResource;

class CommentController extends Controller
{
    // Fetch all comments
    public function index()
    {
        $comments = Comment::all();
        return CommentResource::collection($comments);
    }

    // Fetch a single comment by ID
    public function show($id)
    {
        $comment = Comment::findOrFail($id);
        return new CommentResource($comment);
    }

    // Create a new comment
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'run_plan_id' => 'required|exists:run_plans,id',
            'comment' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $comment = Comment::create([
            'run_plan_id' => $request->run_plan_id,
            'user_id' => auth()->id(), // Get the logged-in user's ID
            'comment' => $request->comment,
        ]);

        return new CommentResource($comment);
    }

    // Update an existing comment
    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'run_plan_id' => 'required|exists:run_plans,id',
            'comment' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $comment->update([
            'run_plan_id' => $request->run_plan_id,
            'comment' => $request->comment,
        ]);

        return new CommentResource($comment);
    }

    // Delete a comment
    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->delete();

        return response()->json(null, 204);
    }
}
