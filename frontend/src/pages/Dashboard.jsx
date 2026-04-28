/**
 * User dashboard: calorie tracking, order history, health profile editor.
 */
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyOrders, updateHealthProfile } from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    setProfile({ ...user.health_profile });
    getMyOrders().then((r) => setOrders(r.data)).catch(() => {});
  }, [user]);

  // Calorie tracking: sum today's ordered calories
  const todayStr = new Date().toISOString().split("T")[0];
  const todayCalories = orders
    .filter((o) => o.created_at?.startsWith(todayStr))
    .flatMap((o) => o.items)
    .reduce((sum, item) => sum + (item.calories || 0), 0);

  const calorieGoal = profile?.calorie_goal || 2000;
  const caloriePercent = Math.min(100, Math.round((todayCalories / calorieGoal) * 100));

  const saveProfile = async () => {
    setSaving(true);
    try {
      await updateHealthProfile(profile);
      setUser((u) => ({ ...u, health_profile: profile }));
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user || !profile) return null;

  const STATUS_COLORS = {
    placed: "bg-blue-100 text-blue-700",
    preparing: "bg-yellow-100 text-yellow-700",
    out_for_delivery: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">My Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {/* Calorie tracker */}
        <div className="card p-5 col-span-1">
          <h2 className="font-semibold mb-3">🔥 Today's Calories</h2>
          <div className="text-3xl font-bold text-brand-500 mb-1">{todayCalories}</div>
          <div className="text-sm text-gray-400 mb-3">of {calorieGoal} kcal goal</div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${caloriePercent > 90 ? "bg-red-400" : "bg-brand-500"}`}
              style={{ width: `${caloriePercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{caloriePercent}% of daily goal</p>
        </div>

        {/* Stats */}
        <div className="card p-5">
          <h2 className="font-semibold mb-3">📊 Stats</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Total Orders</span><span className="font-semibold">{orders.length}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Diet Type</span><span className="font-semibold capitalize">{profile.diet_type}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Health Goal</span><span className="font-semibold capitalize">{profile.health_goal?.replace("_", " ")}</span></div>
          </div>
        </div>

        {/* Health profile editor */}
        <div className="card p-5">
          <h2 className="font-semibold mb-3">⚙️ Health Profile</h2>
          <div className="space-y-2">
            <select value={profile.diet_type} onChange={(e) => setProfile({ ...profile, diet_type: e.target.value })} className="input text-sm">
              {["none","vegan","vegetarian","keto","paleo","diabetic-friendly"].map((d) => <option key={d}>{d}</option>)}
            </select>
            <select value={profile.health_goal} onChange={(e) => setProfile({ ...profile, health_goal: e.target.value })} className="input text-sm">
              {["maintain","weight_loss","high_protein","diabetic_friendly"].map((g) => <option key={g} value={g}>{g.replace("_"," ")}</option>)}
            </select>
            <input type="number" value={profile.calorie_goal} onChange={(e) => setProfile({ ...profile, calorie_goal: Number(e.target.value) })} className="input text-sm" placeholder="Calorie goal" />
            <button onClick={saveProfile} disabled={saving} className="btn-primary w-full text-sm">
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* Order history */}
      <h2 className="text-xl font-bold mb-4">Order History</h2>
      {orders.length === 0 ? (
        <p className="text-gray-400">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">{order.address}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || "bg-gray-100"}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-brand-500">${order.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {order.items.map((item, i) => (
                  <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {item.food_name} × {item.quantity}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
