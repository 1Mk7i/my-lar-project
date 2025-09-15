<?php

namespace App\Http\Controllers\Api\Modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    /**
     * Отримати список користувачів
     */
    public function index()
    {
        // Для демонстрації створюємо фейкових користувачів
        $users = [
            [
                'id' => 1,
                'name' => 'Олександр Петренко',
                'email' => 'oleksandr@example.com',
                'created_at' => '2024-01-15T10:30:00Z'
            ],
            [
                'id' => 2,
                'name' => 'Марія Іваненко',
                'email' => 'maria@example.com',
                'created_at' => '2024-01-16T14:20:00Z'
            ],
            [
                'id' => 3,
                'name' => 'Дмитро Коваленко',
                'email' => 'dmytro@example.com',
                'created_at' => '2024-01-17T09:15:00Z'
            ],
            [
                'id' => 4,
                'name' => 'Анна Сидоренко',
                'email' => 'anna@example.com',
                'created_at' => '2024-01-18T16:45:00Z'
            ]
        ];

        return response()->json([
            'users' => $users,
            'total' => count($users),
            'message' => 'Користувачі завантажені успішно'
        ]);
    }

    /**
     * Отримати одного користувача
     */
    public function show($id)
    {
        // Симуляція пошуку користувача
        $user = [
            'id' => (int)$id,
            'name' => 'Користувач #' . $id,
            'email' => 'user' . $id . '@example.com',
            'created_at' => now()->toISOString()
        ];

        return response()->json($user);
    }

    /**
     * Створити нового користувача
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
        ]);

        // Симуляція створення користувача
        $user = [
            'id' => rand(100, 999),
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'created_at' => now()->toISOString()
        ];

        return response()->json([
            'user' => $user,
            'message' => 'Користувач створений успішно'
        ], 201);
    }

    /**
     * Оновити користувача
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
        ]);

        // Симуляція оновлення користувача
        $user = [
            'id' => (int)$id,
            'name' => $validatedData['name'] ?? 'Оновлений користувач #' . $id,
            'email' => $validatedData['email'] ?? 'updated' . $id . '@example.com',
            'updated_at' => now()->toISOString()
        ];

        return response()->json([
            'user' => $user,
            'message' => 'Користувач оновлений успішно'
        ]);
    }

    /**
     * Видалити користувача
     */
    public function destroy($id)
    {
        // Симуляція видалення користувача
        return response()->json([
            'message' => 'Користувач #' . $id . ' видалений успішно'
        ]);
    }
}