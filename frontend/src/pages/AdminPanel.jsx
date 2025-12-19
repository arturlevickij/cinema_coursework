import { useEffect, useState } from "react";
import api from "../api";
import "../styles/admin.css";

export default function AdminPanel() {
  const [sales, setSales] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [load, setLoad] = useState([]);

  useEffect(() => {
    api.get("/admin/reports/sales").then(res => setSales(res.data));
    api.get("/admin/reports/revenue").then(res => setRevenue(res.data));
    api.get("/admin/reports/load").then(res => setLoad(res.data));
  }, []);

  return (
    <div className="admin-page">
      <h2>📊 Звіти адміністратора</h2>

      <h3>Продані квитки</h3>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          {sales.map((r, i) => (
            <tr key={i}>
              <td>{r.date}</td>
              <td>{r.tickets_sold}</td>
            </tr>
          ))}
        </table>
      </div>

      {}
      <h3>Виручка по сеансах</h3>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          {revenue.map((r, i) => (
            <tr key={i}>
              <td>{r.title}</td>
              <td>{new Date(r.show_datetime).toLocaleString()}</td>
              <td>{r.revenue} грн</td>
            </tr>
          ))}
        </table>
      </div>

      {}
      <h3>Завантаженість залів</h3>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          {load.map((r, i) => (
            <tr key={i}>
              <td>{r.hall}</td>
              <td>{new Date(r.show_datetime).toLocaleString()}</td>
              <td>{r.booked}</td>
              <td>{r.total}</td>
              <td>{r.load_percent}%</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}
