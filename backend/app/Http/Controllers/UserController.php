<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update(['name' => $request->name]);

        return response()->json([
            'message' => 'Профіль оновлено',
            'user' => $user->load('role')
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'current' => 'required|string',
            'new' => 'required|string|min:8',
            'confirm' => 'required|string|same:new',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Hash::check($request->current, $user->password)) {
            return response()->json(['message' => 'Поточний пароль невірний'], 422);
        }

        $user->update(['password' => Hash::make($request->new)]);

        return response()->json(['message' => 'Пароль успішно змінено']);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Видаляємо старий аватар якщо він є
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Зберігаємо новий аватар
        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return response()->json([
            'message' => 'Аватар успішно завантажено',
            'avatar' => Storage::url($path)
        ]);
    }
}

