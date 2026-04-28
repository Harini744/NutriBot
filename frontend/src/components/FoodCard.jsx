/**
 * Reusable food card component used on Home, Search, and Admin pages.
 */
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function FoodCard({ food }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    await addItem(food.id);
  };

  return (
    <Link to={`/food/${food.id}`} className="card block overflow-hidden group">
      {/* Food image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={food.image_url || "https://via.placeholder.com/400x300?text=Food"}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Category badge */}
        <span className="absolute top-2 left-2 bg-white/90 text-xs font-semibold px-2 py-1 rounded-full capitalize">
          {food.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">{food.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{food.description}</p>

        {/* Nutrition quick info */}
        <div className="flex gap-3 mt-2 text-xs text-gray-400">
          <span>🔥 {food.nutrition?.calories} kcal</span>
          <span>💪 {food.nutrition?.protein}g protein</span>
        </div>

        {/* Tags */}
        {food.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {food.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-brand-500">${food.price.toFixed(2)}</span>
          <button
            onClick={handleAdd}
            className="btn-primary text-sm py-1 px-3"
          >
            + Add
          </button>
        </div>
      </div>
    </Link>
  );
}
