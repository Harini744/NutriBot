/**
 * Admin panel: manage food items and view/update all orders.
 */
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getFoods, createFood, updateFood, deleteFood, getAllOrders, updateOrderStatus } from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EMPTY_FOOD = {
  name: "", description: "", price: "", category: "", image_url: "",
  tags: "", available: true,
  nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
};

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("foods");
  const [form, setForm] = useState(EMPTY_FOOD);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (!user.is_admin) { navigate("/"); return; }
    loadFoods();
    loadOrders();
  }, [user]);

  const loadFoods = () => getFoods({}).then((r) => setFoods(r.data));
  const loadOrders = () => getAllOrders().then((r) => setOrders(r.data)).catch(() => {});

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price),
      tags: typeof form.tags === "string" ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : form.tags,
    };
    try {
      if (editId) {
        await updateFood(editId, payload);
        toast.success("Food updated");
      } else {
        await createFood(payload);
        toast.success("Food created");
      }
      setShowForm(false);
      setForm(EMPTY_FOOD);
      setEditId(null);
      loadFoods();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Error saving food");
    }
  };

  const handleEdit = (food) => {
    setForm({ ...food, tags: food.tags?.join(", ") || "" });
    setEditId(food.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this food item?")) return;
    await deleteFood(id);
    toast.success("Deleted");
    loadFoods();
  };

  const handleStatusChange = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
    toast.success("Status updated");
    loadOrders();
  };

  const setN = (key, val) => setForm((f) => ({ ...f, nutrition: { ...f.nutrition, [key]: Number(val) } }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["foods", "orders"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg font-medium capitalize ${tab === t ? "bg-brand-500 text-white" : "bg-white border text-gray-600"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Foods tab */}
      {tab === "foods" && (
        <>
          <button onClick={() => { setForm(EMPTY_FOOD); setEditId(null); setShowForm(true); }} className="btn-primary mb-4">
            + Add Food
          </button>

          {showForm && (
            <form onSubmit={handleSave} className="card p-6 mb-6 grid grid-cols-2 gap-4">
              <h2 className="col-span-2 font-semibold">{editId ? "Edit Food" : "New Food"}</h2>
              {[["name","Name"],["description","Description"],["price","Price"],["category","Category"],["image_url","Image URL"],["tags","Tags (comma-separated)"]].map(([key, label]) => (
                <div key={key} className={key === "description" ? "col-span-2" : ""}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="input" required={["name","price","category"].includes(key)} />
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-sm font-medium mb-2">Nutrition</p>
                <div className="grid grid-cols-5 gap-2">
                  {["calories","protein","carbs","fat","fiber"].map((k) => (
                    <div key={k}>
                      <label className="text-xs text-gray-500 capitalize">{k}</label>
                      <input type="number" value={form.nutrition[k]} onChange={(e) => setN(k, e.target.value)} className="input text-sm" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2 flex gap-3">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-gray-50 text-gray-600">
                <tr>{["Name","Category","Price","Calories","Tags","Actions"].map((h) => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody>
                {foods.map((f) => (
                  <tr key={f.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{f.name}</td>
                    <td className="px-4 py-3 capitalize">{f.category}</td>
                    <td className="px-4 py-3">${f.price}</td>
                    <td className="px-4 py-3">{f.nutrition?.calories}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{f.tags?.join(", ")}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => handleEdit(f)} className="text-blue-500 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Orders tab */}
      {tab === "orders" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm overflow-hidden">
            <thead className="bg-gray-50 text-gray-600">
              <tr>{["Date","User","Total","Items","Status","Update"].map((h) => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-xs">{o.user_id.slice(-6)}</td>
                  <td className="px-4 py-3 font-semibold text-brand-500">${o.total}</td>
                  <td className="px-4 py-3 text-xs">{o.items?.map((i) => i.food_name).join(", ")}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{o.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      {["placed","preparing","out_for_delivery","delivered","cancelled"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
