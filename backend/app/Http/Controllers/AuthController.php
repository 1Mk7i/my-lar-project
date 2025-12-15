<?php
// app/Http/Controllers/AuthController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => 2, // Стандартна роль: Автор
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        
        // Забезпечуємо, що зв'язок Role завантажений для відповіді
        $user->load('role');

        return response()->json([
            'token' => $token,
            'user' => $user,
            'message' => 'Користувача успішно зареєстровано.',
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Неправильні облікові дані.'],
            ]);
        }

        $user = Auth::user();
        
        // 🚩 ВИПРАВЛЕННЯ: Примусово завантажуємо (оновлюємо) зв'язок Role
        // Це гарантує, що якщо роль була змінена в базі, вона повернеться свіжа.
        $user->load('role'); 
        
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        // Відкликаємо поточний токен
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Вихід успішний.',
        ]);
    }
}