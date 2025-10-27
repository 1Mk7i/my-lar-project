<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Get user's cart items
     */
    public function index(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'User not authenticated'
                ], 401);
            }

            $cartItems = $user->cartItems()->with('book')->get();

            $formattedItems = $cartItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'quantity' => $item->quantity,
                    'total_price' => $item->total_price,
                    'book' => [
                        'id' => $item->book->id,
                        'title' => $item->book->title,
                        'author' => $item->book->author,
                        'description' => $item->book->description,
                        'cover_image' => $item->book->cover_image,
                        'price' => (float) $item->book->price,
                        'year' => $item->book->publication_year,
                        'pages' => $item->book->pages,
                        'language' => $item->book->language,
                        'status' => $item->book->status,
                    ]
                ];
            });

            $totalPrice = $cartItems->sum('total_price');
            $totalItems = $cartItems->sum('quantity');

            return response()->json([
                'success' => true,
                'cart_items' => $formattedItems,
                'total_price' => $totalPrice,
                'total_items' => $totalItems
            ]);

        } catch (\Exception $e) {
            \Log::error('Cart Index Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to load cart',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add item to cart
     */
    public function add(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'book_id' => 'required|exists:books,id',
                'quantity' => 'nullable|integer|min:1'
            ]);

            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'User not authenticated'
                ], 401);
            }

            $bookId = $request->book_id;
            $quantity = $request->quantity ?? 1;

            $existingItem = $user->cartItems()->where('book_id', $bookId)->first();

            if ($existingItem) {
                $existingItem->incrementQuantity($quantity);
                $message = 'Кількість оновлено';
            } else {
                CartItem::create([
                    'user_id' => $user->id,
                    'book_id' => $bookId,
                    'quantity' => $quantity
                ]);
                $message = 'Книгу додано до кошика';
            }

            return response()->json([
                'success' => true,
                'message' => $message
            ]);

        } catch (\Exception $e) {
            \Log::error('Cart Add Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to add to cart',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1'
            ]);

            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'User not authenticated'
                ], 401);
            }

            $cartItem = $user->cartItems()->where('id', $id)->firstOrFail();
            $cartItem->update(['quantity' => $request->quantity]);

            return response()->json([
                'success' => true,
                'message' => 'Кількість оновлено'
            ]);

        } catch (\Exception $e) {
            \Log::error('Cart Update Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to update cart',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove item from cart
     */
    public function remove($id): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'User not authenticated'
                ], 401);
            }

            $cartItem = $user->cartItems()->where('id', $id)->firstOrFail();
            $cartItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Книгу видалено з кошика'
            ]);

        } catch (\Exception $e) {
            \Log::error('Cart Remove Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to remove from cart',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear cart
     */
    public function clear(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'User not authenticated'
                ], 401);
            }

            $user->cartItems()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Кошик очищено'
            ]);

        } catch (\Exception $e) {
            \Log::error('Cart Clear Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to clear cart',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}