/**
 * Cart page: view items, update quantities, proceed to checkout.
 */
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, cartTotal, updateItem, cartLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Please login to view your cart.</p>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  if (cartLoading) return <div className="flex justify-center items-center h-64 text-gray-400">Loading cart...</div>;

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link to="/" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <div key={item.food_id} className="card p-4 flex items-center gap-4">
            <img
              src={item.image_url || "https://via.placeholder.com/80"}
              alt={item.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-brand-500 font-bold">${item.price.toFixed(2)}</p>
            </div>
            {/* Quantity controls */}
            <div className="flex items-center gap-2 border rounded-lg overflow-hidden">
              <button
                onClick={() => updateItem(item.food_id, item.quantity - 1)}
                className="px-3 py-2 hover:bg-gray-100 text-lg"
              >
                −
              </button>
              <span className="px-3 font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateItem(item.food_id, item.quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100 text-lg"
              >
                +
              </button>
            </div>
            {/* Remove */}
            <button
              onClick={() => updateItem(item.food_id, 0)}
              className="text-red-400 hover:text-red-600 text-xl"
              aria-label="Remove item"
            >
              🗑
            </button>
            <span className="font-bold w-20 text-right">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="card p-6">
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>Total</span>
          <span className="text-brand-500">${cartTotal.toFixed(2)}</span>
        </div>
        <button onClick={() => navigate("/order")} className="btn-primary w-full text-center">
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}
