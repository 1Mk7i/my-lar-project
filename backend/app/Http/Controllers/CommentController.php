<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    private const ADMIN_ROLE_ID = 3;

    /**
     * Отримання коментарів для конкретної книги.
     * Використовуємо Route Model Binding для автоматичного резолвування Book
     */
    public function index(Book $book): JsonResponse
    {
        $comments = $book->comments()
            ->with(['user.role', 'user.author']) 
            ->orderBy('created_at', 'desc')
            ->paginate(5); 

        return response()->json($comments);
    }

    /**
     * Створення нового коментаря.
     * Використовуємо Route Model Binding для автоматичного резолвування Book
     */
    public function store(Request $request, Book $book): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
             return response()->json(['message' => 'Необхідна автентифікація для створення коментаря.'], 401);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
            'rating' => 'nullable|integer|min:1|max:5', 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        $comment = $book->comments()->create([
            'user_id' => $user->id,
            'content' => $data['content'],
            'rating' => $data['rating'] ?? null,
        ]);
        
        $comment->load(['user.role', 'user.author']); 

        return response()->json($comment, 201);
    }

    /**
     * Оновлення коментаря (Тільки власник).
     * Використовуємо Route Model Binding для автоматичного резолвування Book та Comment
     */
    public function update(Request $request, Book $book, Comment $comment): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Необхідна автентифікація.'], 401);
        }
        
        // Перевіряємо, що коментар належить книзі
        if ($comment->book_id !== $book->id) {
            return response()->json(['message' => 'Коментар не належить цій книзі.'], 404);
        }
        
        if ($comment->user_id !== $user->id) {
            return response()->json(['message' => 'Ви можете редагувати лише власні коментарі.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
            'rating' => 'nullable|integer|min:1|max:5', 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $comment->update($validator->validated());
        $comment->load(['user.role', 'user.author']);

        return response()->json($comment);
    }

    /**
     * Видалення коментаря (Власник або Адмін).
     * Використовуємо Route Model Binding для автоматичного резолвування Book та Comment
     */
    public function destroy(Request $request, Book $book, Comment $comment): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Необхідна автентифікація.'], 401);
        }
        
        // Перевіряємо, що коментар належить книзі
        if ($comment->book_id !== $book->id) {
            return response()->json(['message' => 'Коментар не належить цій книзі.'], 404);
        }
        
        $isAdmin = $user->role_id === self::ADMIN_ROLE_ID;
        $isOwner = $comment->user_id === $user->id;

        if (!$isAdmin && !$isOwner) {
            return response()->json(['message' => 'Недостатньо прав для видалення цього коментаря.'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Коментар успішно видалено.'], 200);
    }
}