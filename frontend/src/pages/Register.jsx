import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return alert("Заповніть всі поля");
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password
      });

      const user = await login(email, password);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/shows");
      }
    } catch (err) {
      alert(
        "Помилка реєстрації: " +
          (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Реєстрація</h2>
        <p className="auth-subtitle">
          Створіть акаунт, щоб бронювати квитки онлайн.
        </p>

        <form onSubmit={submit}>
          <div className="auth-field">
            <label>
              Ім’я
              <input
                placeholder="Ваше ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="auth-field">
            <label>
              Email
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="auth-field">
            <label>
              Пароль
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>

          <button type="submit" style={{ width: "100%" }}>
            Зареєструватися
          </button>
        </form>

        <div className="auth-footer">
          Вже маєш акаунт?{" "}
          <Link to="/login">Увійти</Link>
        </div>
      </div>
    </div>
  );
}
