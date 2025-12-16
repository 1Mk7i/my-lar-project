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
     * 🚩 ВИПРАВЛЕНО: $bookId -> $book
     */
    public function index($book): JsonResponse
    {
        // 🚩 ВИПРАВЛЕНО: Оскільки ми використовуємо $book (який має бути {book} у маршруті),
        // Laravel має автоматично перетворити його на ID. 
        // Якщо ви використовуєте Route Model Binding, цей рядок не потрібен або повинен виглядати як $book->id.
        $bookId = $book; // Якщо $book є ID (без Route Model Binding)
        
        // Якщо ви використовуєте Route Model Binding (CommentController@index(Book $book)), 
        // використовуйте: $bookId = $book->id;
        
        $comments = Comment::where('book_id', $bookId)
            ->with(['user.role', 'user.author']) 
            ->orderBy('created_at', 'desc')
            ->paginate(5); 

        return response()->json($comments);
    }

    /**
     * Створення нового коментаря.
     * 🚩 ВИПРАВЛЕНО: $bookId -> $book
     */
    public function store(Request $request, $book): JsonResponse
    {
        // Якщо $book є ID:
        $bookModel = Book::findOrFail($book); 
        
        // Якщо ви використовуєте Route Model Binding:
        // $bookModel = $book;

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

        $comment = $bookModel->comments()->create([
            'user_id' => $user->id,
            'content' => $data['content'],
            'rating' => $data['rating'] ?? null,
        ]);
        
        $comment->load(['user.role', 'user.author']); 

        return response()->json($comment, 201);
    }

    /**
     * Оновлення коментаря (Тільки власник).
     * 🚩 ВИПРАВЛЕНО: $bookId -> $book, $commentId -> $comment
     */
    public function update(Request $request, $book, $comment): JsonResponse
    {
        // Якщо використовується Route Model Binding, $comment буде об'єктом Comment,
        // і цей рядок не потрібен: $comment = Comment::findOrFail($commentId);
        $commentModel = Comment::findOrFail($comment); // Якщо $comment є ID
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Необхідна автентифікація.'], 401);
        }
        
        if ($commentModel->user_id !== $user->id) {
            return response()->json(['message' => 'Ви можете редагувати лише власні коментарі.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
            'rating' => 'nullable|integer|min:1|max:5', 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $commentModel->update($validator->validated());
        $commentModel->load(['user.role', 'user.author']);

        return response()->json($commentModel);
    }

    /**
     * Видалення коментаря (Власник або Адмін).
     * 🚩 ВИПРАВЛЕНО: $bookId -> $book, $commentId -> $comment
     */
    public function destroy(Request $request, $book, $comment): JsonResponse
    {
        $commentModel = Comment::findOrFail($comment); // Якщо $comment є ID
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Необхідна автентифікація.'], 401);
        }
        
        $isAdmin = $user->role_id === self::ADMIN_ROLE_ID;
        $isOwner = $commentModel->user_id === $user->id;

        if (!$isAdmin && !$isOwner) {
            return response()->json(['message' => 'Недостатньо прав для видалення цього коментаря.'], 403);
        }

        $commentModel->delete();

        return response()->json(['message' => 'Коментар успішно видалено.'], 200);
    }
}