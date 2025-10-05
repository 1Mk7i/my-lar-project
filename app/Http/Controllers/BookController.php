<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\View as ViewFacade;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): View
    {
        $books = Book::latest()->get();
        return view('books.index', compact('books'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): View
    {
        return view('books.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'description' => 'nullable|string',
            'publication_year' => 'required|integer|min:1000|max:' . (date('Y') + 1),
            'isbn' => 'nullable|string|unique:books,isbn',
            'price' => 'nullable|numeric|min:0',
            'pages' => 'nullable|integer|min:1',
            'cover_image' => 'nullable|string|max:255',
            'is_available' => 'boolean'
        ]);

        Book::create($validated);

        return redirect()->route('books.index')
            ->with('success', 'Книжку успішно додано!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book): View
    {
        return view('books.show', compact('book'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book): View
    {
        return view('books.edit', compact('book'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Book $book): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'description' => 'nullable|string',
            'publication_year' => 'required|integer|min:1000|max:' . (date('Y') + 1),
            'isbn' => 'nullable|string|unique:books,isbn,' . $book->id,
            'price' => 'nullable|numeric|min:0',
            'pages' => 'nullable|integer|min:1',
            'cover_image' => 'nullable|string|max:255',
            'is_available' => 'boolean'
        ]);

        $book->update($validated);

        return redirect()->route('books.index')
            ->with('success', 'Інформацію про книжку оновлено!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book): RedirectResponse
    {
        $book->delete();

        return redirect()->route('books.index')
            ->with('success', 'Книжку успішно видалено!');
    }

    /**
     * API method to get all books (optional)
     */
    public function apiIndex()
    {
        $books = Book::all();
        return response()->json($books);
    }

    /**
     * Search books by title or author
     */
    public function search(Request $request): View
    {
        $search = $request->get('search');
        
        $books = Book::where('title', 'like', "%{$search}%")
            ->orWhere('author', 'like', "%{$search}%")
            ->get();

        return view('books.index', compact('books', 'search'));
    }

    /**
     * Filter available books
     */
    public function available(): View
    {
        $books = Book::where('is_available', true)->get();
        return view('books.index', compact('books'));
    }
}