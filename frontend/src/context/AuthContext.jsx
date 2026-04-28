/**
 * AuthContext: provides user state, login, logout, and register actions globally.
 */
import { createContext, useContext, useState, useEffect } from "react";
import { getMe, login as apiLogin, register as apiRegister } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    localStorage.setItem("token", res.data.access_token);
    const me = await getMe();
    setUser(me.data);
    return me.data;
  };

  const register = async (data) => {
    const res = await apiRegister(data);
    localStorage.setItem("token", res.data.access_token);
    const me = await getMe();
    setUser(me.data);
    return me.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
