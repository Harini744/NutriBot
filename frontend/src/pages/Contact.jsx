import { useState } from "react";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-2">Contact Us</h1>
      <p className="text-gray-500 text-center mb-8">Have a question or feedback? We'd love to hear from you.</p>

      <form onSubmit={handleSubmit} className="card p-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Your name" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className="input resize-none" placeholder="Your message..." required />
        </div>
        <button type="submit" className="btn-primary w-full">Send Message</button>
      </form>
    </div>
  );
}
