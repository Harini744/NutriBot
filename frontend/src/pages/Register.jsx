/**
 * Registration page with health profile setup.
 */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const DIET_TYPES = ["none", "vegan", "vegetarian", "keto", "paleo", "diabetic-friendly"];
const HEALTH_GOALS = ["maintain", "weight_loss", "high_protein", "diabetic_friendly"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    diet_type: "none",
    health_goal: "maintain",
    calorie_goal: 2000,
    allergies: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        health_profile: {
          diet_type: form.diet_type,
          health_goal: form.health_goal,
          calorie_goal: Number(form.calorie_goal),
          allergies: form.allergies ? form.allergies.split(",").map((a) => a.trim()) : [],
        },
      });
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-gray-500 text-center text-sm mb-6">Set up your health profile for personalized recommendations</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className="input" placeholder="Jane Doe" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="input" placeholder="you@example.com" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} className="input" placeholder="Min 6 characters" required minLength={6} />
            </div>
          </div>

          <hr className="my-2" />
          <p className="text-sm font-semibold text-gray-600">Health Profile (optional)</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Diet Type</label>
              <select value={form.diet_type} onChange={(e) => set("diet_type", e.target.value)} className="input capitalize">
                {DIET_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Health Goal</label>
              <select value={form.health_goal} onChange={(e) => set("health_goal", e.target.value)} className="input">
                {HEALTH_GOALS.map((g) => <option key={g} value={g}>{g.replace("_", " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Daily Calorie Goal</label>
              <input type="number" value={form.calorie_goal} onChange={(e) => set("calorie_goal", e.target.value)} className="input" min={500} max={5000} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Allergies (comma-separated)</label>
              <input type="text" value={form.allergies} onChange={(e) => set("allergies", e.target.value)} className="input" placeholder="nuts, dairy" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-500 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
