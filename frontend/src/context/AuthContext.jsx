import { createContext, useEffect, useState } from "react";
import api from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ ДОДАЛИ

    // при запуску перевіряємо токен
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false); // ✅ тепер існує
            return;
        }

        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        api.get("/auth/me")
            .then(res => setUser(res.data))
            .catch(() => {
                localStorage.removeItem("token");
                delete api.defaults.headers.common.Authorization;
                setUser(null);
            })
            .finally(() => setLoading(false)); // ✅ тепер існує
    }, []);

    // ЛОГІН
    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });

        localStorage.setItem("token", res.data.token);
        api.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;

        const me = await api.get("/auth/me");
        setUser(me.data);

        return me.data;
    };

    // РЕЄСТРАЦІЯ
    const register = async (name, email, password) => {
        await api.post("/auth/register", { name, email, password });
        return await login(email, password);
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete api.defaults.headers.common.Authorization;
        setUser(null);
    };

    // ✅ НЕ РЕНДЕРИМО ДОДАТОК, ПОКИ НЕ ПЕРЕВІРИЛИ ТОКЕН
    if (loading) return <p>Loading...</p>;


    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
