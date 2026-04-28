/**
 * Home page: hero, search/filter, food grid, AI recommendations.
 */
import { useState, useEffect } from "react";
import { getFoods, getCategories, getRecommendations } from "../api/api";
import FoodCard from "../components/FoodCard";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    getFoods(params)
      .then((r) => setFoods(r.data))
      .finally(() => setLoading(false));
  }, [search, category]);

  useEffect(() => {
    if (user) {
      getRecommendations()
        .then((r) => setRecommendations(r.data))
        .catch(() => {});
    }
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-brand-500 to-orange-400 rounded-3xl p-8 text-white mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2">Eat Smart. Live Better.</h1>
        <p className="text-orange-100 text-lg">AI-powered meal recommendations tailored to your health goals.</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search foods..."
          className="input flex-1"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input sm:w-48"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c} className="capitalize">{c}</option>
          ))}
        </select>
      </div>

      {/* AI Recommendations */}
      {user && recommendations.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            ✨ Recommended for You
            <span className="text-sm font-normal text-gray-400">based on your health profile</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </section>
      )}

      {/* All Foods */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          {search || category ? "Search Results" : "All Menu Items"}
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card h-72 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No foods found. Try a different search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
