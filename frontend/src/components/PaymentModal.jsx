import { useEffect, useState } from "react";
import api from "../api";

export default function PaymentModal({ bookingId, expiresAt, onClose, onPaid }) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [discountId, setDiscountId] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [priceInfo, setPriceInfo] = useState(null);

  // таймер
  useEffect(() => {
    if (!expiresAt) return;
    const end = new Date(expiresAt).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setSecondsLeft(diff);
      if (diff === 0) {
        setError("Час на оплату вийшов. Бронювання буде скасовано.");
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  // завантаження знижок
  useEffect(() => {
    const loadDiscounts = async () => {
      try {
        const res = await api.get("/discounts");
        setDiscounts(res.data);
      } catch (e) {
        console.error("Не вдалося завантажити знижки");
      }
    };
    loadDiscounts();
  }, []);

  // попередній розрахунок ціни при зміні bookingId або discountId
  useEffect(() => {
    if (!bookingId) return;

    const fetchPrice = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}/price`, {
          params: {
            discount_id: discountId || ""
          }
        });
        setPriceInfo(res.data);
      } catch (e) {
        console.error("Не вдалося розрахувати ціну");
      }
    };

    fetchPrice();
  }, [bookingId, discountId]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const handlePay = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess(null);

      if (secondsLeft <= 0) {
        setError("Час на оплату вийшов.");
        return;
      }

      const res = await api.post(`/bookings/${bookingId}/purchase`, {
        discount_id: discountId
      });

      setSuccess(`Оплата успішна. Сума до сплати: ${res.data.finalTotal} грн.`);
      setTimeout(() => {
        onPaid();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Помилка оплати");
    } finally {
      setLoading(false);
    }
  };

  // авто-закриття при закінченні часу
  useEffect(() => {
    if (error && error.includes("Час на оплату вийшов")) {
      const t = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [error, onClose]);

  const handleDiscountChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setDiscountId(value);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}
    >
      <div
        style={{
          background: "#000000ff",
          padding: 20,
          minWidth: 320,
          borderRadius: 8
        }}
      >
        <h3>💳 Оплата бронювання #{bookingId}</h3>

        <p>
          Час до завершення:{" "}
          <b>
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </b>
        </p>

        <div style={{ marginBottom: 10 }}>
          <label>
            Знижка:{" "}
            <select
              value={discountId || ""}
              onChange={handleDiscountChange}
            >
              <option value="">Без знижки</option>
              {discounts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.discount_name} (-{d.discount_percent}%)
                </option>
              ))}
            </select>
          </label>
        </div>

        {priceInfo && (
          <div style={{ marginBottom: 10, fontSize: 14 }}>
            <p style={{ margin: 0 }}>
              Базова сума: <b>{priceInfo.baseTotal} грн</b>
            </p>
            {priceInfo.discountAmount > 0 && (
              <p style={{ margin: 0 }}>
                Знижка: <b>-{priceInfo.discountAmount} грн</b>
              </p>
            )}
            <p style={{ margin: 0 }}>
              До сплати: <b>{priceInfo.finalTotal} грн</b>
            </p>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <div style={{ marginTop: 15 }}>
          <button
            onClick={handlePay}
            disabled={loading || secondsLeft <= 0}
            style={{ marginRight: 10 }}
          >
            ✅ Оплатити
          </button>
          <button
            onClick={async () => {
              if (!window.confirm("Скасувати це бронювання?")) return;
              try {
                setLoading(true);
                await api.patch(`/bookings/${bookingId}/cancel`);
                onClose();
                onPaid();
              } catch (e) {
                setError("Не вдалося скасувати бронювання");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            style={{ marginRight: 10 }}
          >
            ❌ Скасувати бронювання
          </button>
          <button onClick={onClose} disabled={loading}>
            ✖ Закрити
          </button>
        </div>
      </div>
    </div>
  );
}
