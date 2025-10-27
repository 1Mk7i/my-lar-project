<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * Get all books with optional filtering and sorting
     */
    public function apiIndex(Request $request): JsonResponse
    {
        try {
            $query = Book::query();

            // Search filter
            if ($request->has('search') && $request->search) {
                $query->search($request->search);
            }

            // Status filter
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('is_available', $request->status === 'available');
            }

            // Language filter
            if ($request->has('language') && $request->language !== 'all') {
                $query->where('language', $request->language);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'title');
            $sortOrder = $request->get('sort_order', 'asc');

            switch ($sortBy) {
                case 'title':
                    $query->orderBy('title', $sortOrder);
                    break;
                case 'author':
                    $query->orderBy('author', $sortOrder);
                    break;
                case 'year':
                    $query->orderBy('publication_year', $sortOrder === 'asc' ? 'desc' : 'asc');
                    break;
                case 'price':
                    $query->orderBy('price', $sortOrder);
                    break;
                default:
                    $query->orderBy('title', 'asc');
            }

            $books = $query->get();

            $formattedBooks = $books->map(function ($book) {
                return [
                    'id' => $book->id,
                    'title' => $book->title,
                    'author' => $book->author,
                    'description' => $book->description,
                    'isbn' => $book->isbn,
                    'year' => $book->publication_year,
                    'cover_image' => $book->cover_image,
                    'price' => (float) $book->price,
                    'pages' => (int) $book->pages,
                    'language' => $book->language,
                    'status' => $book->status,
                ];
            });

            return response()->json([
                'success' => true,
                'books' => $formattedBooks,
                'count' => $formattedBooks->count(),
                'filters' => [
                    'search' => $request->search,
                    'status' => $request->status,
                    'language' => $request->language,
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder,
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Book API Index Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to load books',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single book
     */
    public function apiShow($id): JsonResponse
    {
        try {
            $book = Book::find($id);

            if (!$book) {
                return response()->json([
                    'success' => false,
                    'error' => 'Book not found'
                ], 404);
            }

            $bookData = [
                'id' => $book->id,
                'title' => $book->title,
                'author' => $book->author,
                'description' => $book->description,
                'isbn' => $book->isbn,
                'year' => $book->publication_year,
                'cover_image' => $book->cover_image,
                'price' => (float) $book->price,
                'pages' => (int) $book->pages,
                'language' => $book->language,
                'status' => $book->status,
                'created_at' => $book->created_at,
                'updated_at' => $book->updated_at,
            ];

            return response()->json([
                'success' => true,
                'book' => $bookData
            ]);

        } catch (\Exception $e) {
            \Log::error('Book API Show Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to load book',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}