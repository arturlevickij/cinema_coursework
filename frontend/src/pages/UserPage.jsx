import { useEffect, useState } from "react";
import api from "../api";
import PaymentModal from "../components/PaymentModal";

export default function UserPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payBooking, setPayBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    const res = await api.get("/bookings/my");

    const map = {};
    res.data.forEach(row => {
      if (!map[row.booking_id]) {
        map[row.booking_id] = {
          id: row.booking_id,
          show_id: row.show_id,
          status: row.status,
          expires_at: row.expires_at,
          seats: []
        };
      }
      if (row.row_no) {
        map[row.booking_id].seats.push({
          row: row.row_no,
          seat: row.seat_no
        });
      }
    });

    setBookings(Object.values(map));
    setLoading(false);
  };

  // ⏱ таймер по всім бронюванням
  useEffect(() => {
    const interval = setInterval(() => {
      setBookings(prev =>
        prev.map(b => {
          if (!b.expires_at || b.status !== "active") return b;

          const end = new Date(b.expires_at).getTime();
          const diff = Math.max(0, Math.floor((end - Date.now()) / 1000));

          return {
            ...b,
            secondsLeft: diff
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Скасувати бронювання?")) return;
    await api.patch(`/bookings/${id}/cancel`);
    loadBookings();
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Видалити бронювання?")) return;
    await api.delete(`/bookings/${id}`);
    loadBookings();
  };

  const handlePaid = async () => {
    setPayBooking(null);
    await loadBookings();
  };

  if (loading) return <p>Завантаження...</p>;

  const formatTime = (seconds) => {
    if (seconds == null) return "";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>👤 Мій кабінет</h2>

      {bookings.map(b => (
        <div key={b.id} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 15 }}>
          <p><b>ID:</b> {b.id}</p>
          <p><b>Сеанс:</b> {b.show_id}</p>
          <p>
            <b>Статус:</b> {b.status}
            {b.status === "active" && b.secondsLeft !== undefined && (
              <> | ⏱ Залишилось: {formatTime(b.secondsLeft)}</>
            )}
          </p>

          <ul>
            {b.seats.map((s, i) => (
              <li key={i}>Ряд {s.row}, місце {s.seat}</li>
            ))}
          </ul>

          {b.status === "active" && (
            <>
              <button
                onClick={() => setPayBooking(b)}
                disabled={b.secondsLeft !== undefined && b.secondsLeft <= 0}
              >
                💳 Оплатити
              </button>{" "}
              <button onClick={() => cancelBooking(b.id)}>
                ❌ Скасувати
              </button>
            </>
          )}

          {b.status === "canceled" && (
            <button onClick={() => deleteBooking(b.id)}>
              🗑 Видалити
            </button>
          )}
        </div>
      ))}

      {payBooking && (
        <PaymentModal
          bookingId={payBooking.id}
          expiresAt={payBooking.expires_at}
          onClose={() => setPayBooking(null)}
          onPaid={handlePaid}
        />
      )}
    </div>
  );
}
