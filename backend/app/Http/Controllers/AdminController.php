<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Book;
use App\Models\Comment;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    private const ADMIN_ROLE_ID = 3;

    /**
     * Перевірка, чи користувач є адміністратором
     */
    private function checkAdmin(Request $request): bool
    {
        $user = $request->user();
        return $user && $user->role_id === self::ADMIN_ROLE_ID;
    }

    /**
     * GET /api/admin/users - Отримання всіх користувачів (з пагінацією)
     */
    public function getUsers(Request $request): JsonResponse
    {
        if (!$this->checkAdmin($request)) {
            return response()->json(['message' => 'Доступ заборонено. Тільки для адміністраторів.'], 403);
        }

        $perPage = $request->input('per_page', 15);
        $users = User::with('role')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($users);
    }

    /**
     * GET /api/admin/roles - Отримання всіх ролей
     */
    public function getRoles(Request $request): JsonResponse
    {
        if (!$this->checkAdmin($request)) {
            return response()->json(['message' => 'Доступ заборонено. Тільки для адміністраторів.'], 403);
        }

        $roles = \App\Models\Role::all();
        return response()->json($roles);
    }

    /**
     * PUT /api/admin/users/{user} - Оновлення користувача (роль, блокування)
     */
    public function updateUser(Request $request, User $user): JsonResponse
    {
        if (!$this->checkAdmin($request)) {
            return response()->json(['message' => 'Доступ заборонено. Тільки для адміністраторів.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'role_id' => 'sometimes|integer|exists:roles,id',
            'is_blocked' => 'sometimes|boolean',
            'block_reason' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // Не дозволяємо блокувати або змінювати роль адміністратора
        if ($user->role_id === self::ADMIN_ROLE_ID && $request->user()->id !== $user->id) {
            return response()->json(['message' => 'Не можна змінювати дані іншого адміністратора.'], 403);
        }

        if (isset($data['is_blocked']) && $data['is_blocked']) {
            $data['block_reason'] = $data['block_reason'] ?? 'Заблоковано адміністратором';
        } elseif (isset($data['is_blocked']) && !$data['is_blocked']) {
            $data['block_reason'] = null;
        }

        $user->update($data);
        $user->load('role');

        return response()->json(['message' => 'Користувача оновлено.', 'user' => $user]);
    }

    /**
     * DELETE /api/admin/users/{user} - Видалення користувача
     */
    public function deleteUser(Request $request, User $user): JsonResponse
    {
        if (!$this->checkAdmin($request)) {
            return response()->json(['message' => 'Доступ заборонено. Тільки для адміністраторів.'], 403);
        }

        // Не дозволяємо видаляти адміністраторів
        if ($user->role_id === self::ADMIN_ROLE_ID) {
            return response()->json(['message' => 'Не можна видалити адміністратора.'], 403);
        }

        // Не дозволяємо видаляти самого себе
        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'Не можна видалити самого себе.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Користувача видалено.']);
    }

    /**
     * GET /api/admin/stats - Отримання статистики системи
     */
    public function getStats(Request $request): JsonResponse
    {
        if (!$this->checkAdmin($request)) {
            return response()->json(['message' => 'Доступ заборонено. Тільки для адміністраторів.'], 403);
        }

        $stats = [
            'users' => User::count(),
            'books' => Book::count(),
            'comments' => Comment::count(),
            'orders' => Cart::whereHas('items')->distinct('user_id')->count('user_id'), // Кількість користувачів з замовленнями
            'active_users' => User::where('is_blocked', false)->count(),
            'blocked_users' => User::where('is_blocked', true)->count(),
            'blocked_books' => Book::where('is_blocked', true)->count(),
        ];

        return response()->json($stats);
    }
}

