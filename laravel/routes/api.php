<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserStatController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\RunParticipantController;
use App\Http\Controllers\RunPlanController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::put('/user', [AuthController::class, 'update'])->middleware('auth:sanctum');

Route::get('/run-plans', [RunPlanController::class, 'index']);
Route::get('/comments', [CommentController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/run-participants', [RunParticipantController::class, 'index']);
    Route::get('/run-participants/{id}', [RunParticipantController::class, 'show']);
    Route::post('/run-participants', [RunParticipantController::class, 'store']);
    Route::put('/run-participants/{id}', [RunParticipantController::class, 'update']);
    Route::delete('/run-participants/{id}', [RunParticipantController::class, 'destroy']);


    
    Route::get('/run-plans/{id}', [RunPlanController::class, 'show']);
    Route::post('/run-plans', [RunPlanController::class, 'store']);
    Route::put('/run-plans/{id}', [RunPlanController::class, 'update']);
    Route::delete('/run-plans/{id}', [RunPlanController::class, 'destroy']);


   
    Route::get('/comments/{id}', [CommentController::class, 'show']);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);
});


Route::apiResource('user-stats', UserStatController::class);