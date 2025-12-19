import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return alert("Заповніть всі поля");
    }

    try {
      setLoading(true);

      const user = await login(email, password);

    if (user.role === "admin") {
    navigate("/admin");
    } else {
    navigate("/");
    }
    } catch (err) {
      alert(err?.response?.data?.error || "Помилка авторизації");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Вхід до CINEBOOK</h2>
        <p className="auth-subtitle">
          Увійдіть, щоб бронювати квитки та керувати своїми бронюваннями.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>
              Email
              <input
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
          </div>

          <div className="auth-field">
            <label>
              Пароль
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                required
              />
            </label>
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Вхід..." : "Увійти"}
          </button>
        </form>

        <div className="auth-footer">
          Ще не маєш акаунта?{" "}
          <Link to="/register">Зареєструватися</Link>
        </div>
      </div>
    </div>
  );
}
