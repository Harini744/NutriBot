/**
 * Responsive navigation bar with cart badge and auth links.
 */
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-brand-500">
          🍽 NutriEats
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-brand-500 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-brand-500 transition-colors">About</Link>
          <Link to="/contact" className="hover:text-brand-500 transition-colors">Contact</Link>
          {user && (
            <>
              <Link to="/dashboard" className="hover:text-brand-500 transition-colors">Dashboard</Link>
              {user.is_admin && (
                <Link to="/admin" className="hover:text-brand-500 transition-colors">Admin</Link>
              )}
            </>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link to="/cart" className="relative p-2 hover:text-brand-500 transition-colors">
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-600">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} className="btn-secondary text-sm py-1 px-3">
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link to="/login" className="btn-secondary text-sm py-1 px-3">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-1 px-3">Sign Up</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3 text-sm font-medium text-gray-600">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              {user.is_admin && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
              <button onClick={handleLogout} className="text-left text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
