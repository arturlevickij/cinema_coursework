import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import SeatMap from "../components/SeatMap";
import PaymentModal from "../components/PaymentModal";
import "../styles/showDetails.css";

export default function ShowDetails() {
  const { id } = useParams();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [bookingId, setBookingId] = useState(null);
  const [bookingExpiresAt, setBookingExpiresAt] = useState(null);

  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadSeats = async () => {
    const res = await api.get(`/shows/${id}/seats`);
    setSeats(res.data);
  };

  useEffect(() => {
    const load = async () => {
      const showRes = await api.get(`/shows/${id}`);
      setShow(showRes.data);
      await loadSeats();
    };
    load();
  }, [id]);

  const toggleSeat = (seatId) => {
    if (bookingId) return;

    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId]
    );
  };

  const bookSeats = async () => {
    try {
      setLoading(true);

      const res = await api.post("/bookings", {
        show_id: id,
        seat_ids: selectedSeats
      });

      setBookingId(res.data.id);
      setBookingExpiresAt(res.data.expires_at);
      setMessage(res.data.message);

      setSelectedSeats([]);
      await loadSeats();
      setShowPayment(true);
    } catch (err) {
      alert(err.response?.data?.error || "Помилка бронювання");
    } finally {
      setLoading(false);
    }
  };

  const handlePaid = async () => {
    setShowPayment(false);
    setBookingId(null);
    setBookingExpiresAt(null);
    setMessage("Квитки успішно оплачені ✅");
    await loadSeats();
  };

  if (!show) return null;

  return (
    <div className="show-details-page">
      <div style={{ display: "flex", gap: 20 }}>
        {show.poster_url && (
          <img
            src={show.poster_url}
            alt={show.title}
            style={{
              width: 200,
              height: 300,
              objectFit: "cover",
              borderRadius: 8
            }}
          />
        )}
        <div>
          <h2>{show.title}</h2>
          <p className="show-details-meta">{show.description}</p>
          <p>
            <b>{new Date(show.show_datetime).toLocaleString()}</b>
            {" • Зал: "}{show.hall_name}
          </p>
        </div>
      </div>

      <div className="seatmap-wrapper">
        <h3 className="seatmap-title">Схема залу</h3>
        <SeatMap
          seats={seats}
          selected={selectedSeats}
          onToggle={toggleSeat}
        />
      </div>

      {message && <p style={{ marginTop: 12 }}>ℹ️ {message}</p>}

      {!bookingId && (
        <button
          disabled={!selectedSeats.length || loading}
          onClick={bookSeats}
          style={{ marginTop: 16 }}
        >
          🕒 Забронювати
        </button>
      )}

      {showPayment && (
        <PaymentModal
          bookingId={bookingId}
          expiresAt={bookingExpiresAt}
          onClose={() => setShowPayment(false)}
          onPaid={handlePaid}
        />
      )}
    </div>
  );
}
