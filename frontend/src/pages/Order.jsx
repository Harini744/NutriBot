/**
 * Checkout / Order page: address, mock payment, order placement.
 */
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { placeOrder } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Order() {
  const { cart, cartTotal, clearAll } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("mock_card");
  const [loading, setLoading] = useState(false);

  if (!user) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-500 mb-4">Please login to checkout.</p>
      <Link to="/login" className="btn-primary">Login</Link>
    </div>
  );

  if (cart.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-500 mb-4">Your cart is empty.</p>
      <Link to="/" className="btn-primary">Browse Menu</Link>
    </div>
  );

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) { toast.error("Please enter a delivery address"); return; }
    setLoading(true);
    try {
      const items = cart.map((i) => ({
        food_id: i.food_id,
        food_name: i.name,
        price: i.price,
        quantity: i.quantity,
      }));
      await placeOrder({ items, address, payment_method: payment, total: cartTotal });
      await clearAll();
      toast.success("Order placed successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleOrder} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Delivery Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="Enter your full delivery address..."
              className="input resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <div className="space-y-2">
              {[
                { value: "mock_card", label: "💳 Credit / Debit Card (Mock)" },
                { value: "mock_cash", label: "💵 Cash on Delivery" },
                { value: "mock_wallet", label: "📱 Digital Wallet (Mock)" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value={opt.value}
                    checked={payment === opt.value}
                    onChange={() => setPayment(opt.value)}
                    className="accent-brand-500"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Placing Order..." : `Place Order – $${cartTotal.toFixed(2)}`}
          </button>
        </form>

        {/* Order summary */}
        <div className="card p-5 h-fit">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {cart.map((item) => (
              <div key={item.food_id} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-brand-500">${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
