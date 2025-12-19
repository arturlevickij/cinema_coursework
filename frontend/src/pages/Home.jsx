import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../styles/home.css";

export default function Home() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/shows");
        setShows(res.data.slice(0, 10));
      } catch (e) {
        console.error("Failed to load shows", e);
      }
    };
    load();
  }, []);

  return (
    <div className="home-page">
      <div className="hero">
        <h1 className="hero-title">Ласкаво просимо до CINEBOOK</h1>
        <p className="hero-subtitle">
          Обирайте найкращі місця в улюбленому театрі / кінотеатрі онлайн.
        </p>
        <Link to="/shows">
          <button style={{ marginTop: 12 }}>Перейти до сеансів</button>
        </Link>
      </div>

      <h2>Найближчі сеанси</h2>

      <div className="slider-container">
        <div className="slider-track">
          {shows.map((show) => (
            <div key={show.id} className="slider-card">
              {show.poster_url && (
                <img
                  src={show.poster_url}
                  alt={show.title}
                  className="slider-poster"
                />
              )}
              <div className="slider-body">
                <div style={{ fontWeight: 600 }}>{show.title}</div>
                <div style={{ opacity: 0.8, margin: "4px 0" }}>
                  {new Date(show.show_datetime).toLocaleString()}
                </div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  Зал: {show.hall_name}
                </div>
                <Link to={`/shows/${show.id}`} style={{ fontSize: 12 }}>
                  🎟 Забронювати
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
