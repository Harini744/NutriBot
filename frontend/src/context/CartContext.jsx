/**
 * CartContext: manages cart state and syncs with backend.
 */
import { createContext, useContext, useState, useEffect } from "react";
import { getCart, addToCart as apiAdd, updateCart as apiUpdate, clearCart as apiClear } from "../api/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return setCart([]);
    try {
      setCartLoading(true);
      const res = await getCart();
      setCart(res.data.items || []);
    } catch {
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addItem = async (food_id, quantity = 1) => {
    await apiAdd({ food_id, quantity });
    toast.success("Added to cart");
    fetchCart();
  };

  const updateItem = async (food_id, quantity) => {
    await apiUpdate({ food_id, quantity });
    fetchCart();
  };

  const clearAll = async () => {
    await apiClear();
    setCart([]);
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartLoading, cartCount, cartTotal, addItem, updateItem, clearAll, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
