import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import "../styles/shows.css";

export default function Shows() {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const fetchShows = async () => {
        try {
            const res = await api.get("/shows");
            setShows(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShows();
    }, []);

    const deleteShow = async (id) => {
        if (!window.confirm("Видалити сеанс?")) return;

        try {
            await api.delete(`/shows/${id}`);
            fetchShows();
        } catch (err) {
            alert("Помилка видалення");
        }
    };

    if (loading) {
        return <div style={{ padding: 20 }}>Loading...</div>;
    }

  return (
    <div className="shows-page">
      <h1>🎬 Сеанси</h1>

      {user?.role === "admin" && (
        <Link to="/admin/shows/new">➕ Додати сеанс</Link>
      )}

      <div className="shows-grid">
        {shows.map(show => (
        <div key={show.id} className="card">
        <div style={{ display: "flex", gap: 12 }}>
            {show.poster_url && (
            <img
                src={show.poster_url}
                alt={show.title}
                style={{
                width: 80,
                height: 120,
                objectFit: "cover",
                borderRadius: 4,
                flexShrink: 0
                }}
            />
            )}
            <div>
            <h3 className="show-card-title">{show.title}</h3>
            <p className="show-card-description">{show.description}</p>
            <p className="show-card-meta">
                <b>{new Date(show.show_datetime).toLocaleString()}</b>
                <br />
                Зал: {show.hall_name}
            </p>
            </div>
        </div>
            <div style={{ marginTop: 12 }}>
              <Link to={`/shows/${show.id}`}>🎟 Деталі</Link>
              {user?.role === "admin" && (
                <>
                  {" | "}
                  <Link to={`/admin/shows/${show.id}/edit`}>✏️ Редагувати</Link>{" "}
                  <button
                    style={{ marginLeft: 8, background: "#ff4d4f" }}
                    onClick={() => deleteShow(show.id)}
                  >
                    Видалити
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
