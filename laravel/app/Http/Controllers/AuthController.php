<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg', // Dodato za validaciju slike
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
    
        $profilePhotoPath = null;
        
        // Proveravamo da li je slika postavljena
        if ($request->hasFile('profile_photo')) {
            $profilePhotoPath = $request->file('profile_photo')->store('profile_photos', 'public');
        }
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'profilePhoto' => $profilePhotoPath, // Čuvamo putanju slike u bazi
            'role_id' => 2, //svaki put kad se registruje uvek ce biti obican ulogovan korisnik
        ]);
    
        $token = $user->createToken('auth_token')->plainTextToken;
    
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'profile_photo_url' => $profilePhotoPath ? Storage::url($profilePhotoPath) : null,
        ]);
    }
    /**
     * Log in an existing user.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Log out the user (revoke the token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out',
        ]);
    }
     /**
     * Update the authenticated user's information.
     */
    public function update(Request $request)
    {
        // Validiramo unos, zabranjujući promenu email-a
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'password' => 'nullable|string|min:8|confirmed',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg', // Validacija za novu sliku
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = $request->user(); // Dohvatamo trenutno ulogovanog korisnika

        DB::beginTransaction(); // Započinjemo transakciju

        try {
            // Ako je postavljena nova slika, prvo brišemo staru
            if ($request->hasFile('profile_photo')) {
                if ($user->profilePhoto) {
                    Storage::disk('public')->delete($user->profilePhoto); // Brisanje stare slike
                }

                // Čuvamo novu sliku i ažuriramo putanju u bazi
                $user->profilePhoto = $request->file('profile_photo')->store('profile_photos', 'public');
            }

            // Ažuriramo ostale atribute korisnika
            $user->name = $request->name;

            // Ako je postavljena nova lozinka, hashujemo je i ažuriramo
            if ($request->password) {
                $user->password = Hash::make($request->password);
            }

            $user->save(); // Čuvamo promene u bazi

            DB::commit(); // Zatvaramo transakciju

            return response()->json([
                'message' => 'User updated successfully',
                'profile_photo_url' => $user->profilePhoto ? Storage::url($user->profilePhoto) : null,
            ]);
        } catch (\Exception $e) {
            DB::rollBack(); // U slučaju greške, vraćamo promene
            return response()->json(['error' => 'An error occurred while updating the user.'], 500);
        }
    }
}
