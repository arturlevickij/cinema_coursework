import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function AdminShowForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration_minutes: "",
    hall_id: "",
    show_datetime: "",
    poster_url: ""
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      const res = await api.get(`/shows/${id}`);
      const show = res.data;
      setForm({
        title: show.title || "",
        description: show.description || "",
        duration_minutes: show.duration_minutes || "",
        hall_id: show.hall_id || "",
        show_datetime: show.show_datetime?.slice(0, 16) || "",
        poster_url: show.poster_url || ""
      });
    };
    load();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      duration_minutes: Number(form.duration_minutes),
      show_datetime: form.show_datetime,
      poster_url: form.poster_url || null
    };

    if (!isEdit) {
      payload.hall_id = Number(form.hall_id);
    }

    try {
      if (isEdit) {
        await api.put(`/admin/show/${id}`, payload);
      } else {
        await api.post("/admin/show", payload);
      }
      navigate("/shows");
    } catch (err) {
      alert(err.response?.data?.error || "Помилка збереження сеансу");
    }
  };

  return (
    <div className="page-container">
      <h2>{isEdit ? "Редагувати сеанс" : "Новий сеанс"}</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div style={{ marginBottom: 10 }}>
          <label>
            Назва:
            <br />
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Опис:
            <br />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{ width: "100%" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Тривалість (хв):
            <br />
            <input
              type="number"
              name="duration_minutes"
              value={form.duration_minutes}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Зал (ID):
            <br />
            <input
              type="number"
              name="hall_id"
              value={form.hall_id}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
              disabled={isEdit}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Дата і час:
            <br />
            <input
              type="datetime-local"
              name="show_datetime"
              value={form.show_datetime}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Посилання на постер:
            <br />
            <input
              type="text"
              name="poster_url"
              value={form.poster_url}
              onChange={handleChange}
              placeholder="https://..."
              style={{ width: "100%" }}
            />
          </label>
          {form.poster_url && (
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 12, opacity: 0.8 }}>Попередній перегляд:</span>
              <br />
              <img
                src={form.poster_url}
                alt="Poster preview"
                style={{
                  width: 120,
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 4,
                  marginTop: 4
                }}
              />
            </div>
          )}
        </div>

        <button type="submit">
          {isEdit ? "Зберегти" : "Створити"}
        </button>
      </form>
    </div>
  );
}
