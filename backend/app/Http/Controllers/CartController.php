<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            // Знаходимо кошик або створюємо, якщо його немає
            $cart = Cart::firstOrCreate(['user_id' => $user->id]);

            // Завантажуємо зв'язки. Якщо items порожній - це нормально.
            $cart->load(['items.book']);

            return response()->json($cart);
        } catch (\Exception $e) {
            // Цей JSON ми побачимо у вкладці Response в браузері
            return response()->json([
                'error' => 'Backend Error',
                'message' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function addToCart(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);

        // Шукаємо, чи є вже така книга в кошику
        $cartItem = $cart->items()->where('book_id', $request->book_id)->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $request->quantity);
            $cartItem->load('book');
        } else {
            $cartItem = $cart->items()->create([
                'book_id' => $request->book_id,
                'quantity' => $request->quantity
            ]);
            $cartItem->load('book');
        }

        // Завантажуємо всі items з книгами для повернення
        $cart->load(['items.book']);

        return response()->json([
            'message' => 'Товар додано до кошика',
            'cart' => $cart
        ]);
    }

    public function removeItem($itemId)
    {
        // Видаляємо тільки якщо цей item належить кошику поточного користувача
        $cart = Cart::where('user_id', Auth::id())->first();
        if ($cart) {
            $cart->items()->where('id', $itemId)->delete();
        }

        return response()->json(['message' => 'Товар видалено']);
    }

    public function updateQuantity(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = Cart::where('user_id', Auth::id())->first();
        
        if (!$cart) {
            return response()->json(['message' => 'Кошик не знайдено'], 404);
        }

        $cartItem = $cart->items()->where('id', $itemId)->first();
        
        if (!$cartItem) {
            return response()->json(['message' => 'Товар не знайдено в кошику'], 404);
        }

        $cartItem->update(['quantity' => $request->quantity]);
        $cartItem->load('book');

        return response()->json(['message' => 'Кількість оновлено', 'item' => $cartItem]);
    }
}