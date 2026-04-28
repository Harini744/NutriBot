/**
 * Food detail page: full info, nutrition breakdown, add to cart.
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFood } from "../api/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function FoodView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [food, setFood] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFood(id)
      .then((r) => setFood(r.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    await addItem(food.id, qty);
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-400">Loading...</div>;
  if (!food) return null;

  const n = food.nutrition || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="text-brand-500 mb-6 flex items-center gap-1 hover:underline">
        ← Back
      </button>

      <div className="card overflow-hidden md:flex">
        {/* Image */}
        <div className="md:w-1/2 h-64 md:h-auto">
          <img
            src={food.image_url || "https://via.placeholder.com/600x400?text=Food"}
            alt={food.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs bg-brand-50 text-brand-600 px-2 py-1 rounded-full capitalize">{food.category}</span>
            <h1 className="text-2xl font-bold mt-2 mb-1">{food.name}</h1>
            <p className="text-gray-500 text-sm mb-4">{food.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {food.tags?.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{tag}</span>
              ))}
            </div>

            {/* Nutrition */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h3 className="font-semibold text-sm mb-3 text-gray-700">Nutrition Info (per serving)</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Calories", value: `${n.calories} kcal`, icon: "🔥" },
                  { label: "Protein", value: `${n.protein}g`, icon: "💪" },
                  { label: "Carbs", value: `${n.carbs}g`, icon: "🌾" },
                  { label: "Fat", value: `${n.fat}g`, icon: "🥑" },
                  { label: "Fiber", value: `${n.fiber}g`, icon: "🥦" },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-lg p-2 shadow-sm">
                    <div className="text-lg">{item.icon}</div>
                    <div className="text-xs text-gray-500">{item.label}</div>
                    <div className="font-semibold text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price + Add to cart */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-brand-500">${food.price.toFixed(2)}</span>
            <div className="flex items-center gap-2 border rounded-lg overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-gray-100">−</button>
              <span className="px-3 font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-gray-100">+</button>
            </div>
            <button onClick={handleAdd} className="btn-primary flex-1">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
