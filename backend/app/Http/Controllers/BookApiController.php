<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Publisher;
use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class BookApiController extends Controller
{
    /**
     * Display a listing of the resource (with flexible search and filtering).
     */
    public function index(Request $request): JsonResponse
    {
        $query = $request->input('query');
        $genreId = $request->input('genre_id');
        $publisherId = $request->input('publisher_id');
        
        $books = Book::with(['author.user', 'publisher', 'genres']);

        if ($query) {
            $books->where(function ($q) use ($query) {
                $q->where('title', 'LIKE', '%' . $query . '%')
                  ->orWhere('description', 'LIKE', '%' . $query . '%')
                  ->orWhereHas('author.user', function ($q) use ($query) {
                      $q->where('name', 'LIKE', '%' . $query . '%');
                  });
            });
        }

        if ($genreId) {
            $books->whereHas('genres', function ($q) use ($genreId) {
                $q->where('genre_id', $genreId);
            });
        }

        if ($publisherId) {
            $books->where('publisher_id', $publisherId);
        }
        
        $books = $books->orderBy('title', 'asc')->paginate(10); 
        
        return response()->json($books);
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        return response()->json(
            Book::with(['author.user', 'publisher', 'genres'])->findOrFail($id)
        );
    }

    /**
     * Store a newly created resource in storage (Створення чернетки).
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // 1. Авторизація: Тільки Адмін (3) або Автор (2)
        if (!$user || ($user->role_id !== 3 && $user->role_id !== 2)) {
            return response()->json(['message' => 'Недостатньо прав для створення книги.'], 403);
        }
        
        $author = $user->author;
        $authorId = null;

        // 2. Визначення ID Автора:
        if ($user->role_id === 2) {
            // Для Автора: якщо профіль відсутній, СТВОРЮЄМО його автоматично
            if (!$author) {
                $author = Author::create([
                    'user_id' => $user->id,
                    // Додайте тут інші необхідні поля автора, якщо вони є
                ]);
            }
            $authorId = $author->id;
            
        } elseif ($user->role_id === 3) {
            // Для Адміна:
            if ($author) {
                $authorId = $author->id;
            } else {
                // Якщо Адмін не має профілю, використовуємо ID першого автора в системі.
                $defaultAuthor = Author::first();
                if (!$defaultAuthor) {
                    return response()->json(['message' => 'Системна помилка: в базі даних відсутні профілі авторів.'], 500);
                }
                $authorId = $defaultAuthor->id;
            }
        }
        
        if (!$authorId) {
             return response()->json(['message' => 'Не вдалося визначити ID автора.'], 500);
        }
        
        // 3. Безпечне отримання ID видавництва
        $publisher = Publisher::first();

        if (!$publisher) {
            return response()->json(['message' => 'Системна помилка: в базі даних відсутні видавництва.'], 500);
        }
        
        // 4. Створення порожньої книги (Чернетки)
        $book = Book::create([
            'title' => 'Нова книга (Чернетка)',
            'description' => 'Ця книга є чернеткою і потребує заповнення.',
            'year' => date('Y'),
            'price' => 0.00,
            'publisher_id' => $publisher->id, 
            'author_id' => $authorId, 
        ]);
        
        // 5. Повертаємо ID нової книги
        return response()->json([
            'message' => 'Чернетку книги успішно створено.',
            'book_id' => $book->id
        ], 201); 
    }

    /**
     * Оновлення даних книги.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $book = Book::with('author.user')->findOrFail($id);
        $user = $request->user(); 
        
        // 1. Перевірка політики авторизації
        $canEdit = 
            $user->role_id === 3 ||
            ($user->role_id === 2 && $book->author->user_id === $user->id);

        if (!$canEdit) {
            return response()->json([
                'message' => 'Недостатньо прав для редагування цієї книги.'
            ], 403);
        }

        // 2. Валідація
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'year' => 'required|integer|min:1900|max:' . date('Y'),
            'price' => 'required|numeric|min:0',
            'publisher_id' => 'required|exists:publishers,id',
            'author_id' => 'required|exists:authors,id',
            'genres' => 'nullable|array',
            'genres.*' => 'exists:genres,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Помилка валідації.',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        
        // 3. Оновлення
        $book->update([
            'title' => $data['title'],
            'description' => $data['description'] ?? $book->description,
            'year' => $data['year'],
            'price' => $data['price'],
            'publisher_id' => $data['publisher_id'],
            'author_id' => $data['author_id'],
        ]);

        // 4. Оновлення зв'язку "Багато до Багатьох" (Жанри)
        if (isset($data['genres'])) {
            $book->genres()->sync($data['genres']);
        } else {
            $book->genres()->detach(); 
        }

        return response()->json([
            'message' => 'Книгу успішно оновлено.',
            'book' => $book->load(['author.user', 'publisher', 'genres'])
        ]);
    }

    /**
     * Remove the specified resource from storage (Видалення книги).
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $book = Book::with('author.user')->findOrFail($id);
        $user = $request->user();
        
        // 1. Перевірка політики авторизації
        $canDelete = 
            $user->role_id === 3 || 
            ($user->role_id === 2 && $book->author->user_id === $user->id);

        if (!$canDelete) {
            return response()->json([
                'message' => 'Недостатньо прав для видалення цієї книги.'
            ], 403); 
        }
        
        // 2. Видалення
        $book->delete();

        return response()->json(['message' => 'Книгу успішно видалено.']);
    }
}