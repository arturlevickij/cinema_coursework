import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          CINE<span>BOOK</span>
        </div>
        <div className="navbar-links">
          <Link to="/">Головна</Link>
          {user && user.role === "user" && (
            <>
              <Link to="/shows">Сеанси</Link>
              <Link to="/user">Мій кабінет</Link>
            </>
          )}
          {user && user.role === "admin" && (
            <>
              <Link to="/shows">Сеанси</Link>
              <Link to="/admin">Адмін</Link>
            </>
          )}
        </div>
      </div>

      <div>
        {!user ? (
          <>
            <Link to="/login">Увійти</Link>{" "}
            <Link to="/register">Реєстрація</Link>
          </>
        ) : (
          <>
            <span className="navbar-user">Привіт, {user.name}</span>
            <button onClick={handleLogout}>Вийти</button>
          </>
        )}
      </div>
    </nav>
  );
}
