const ShowsService = require("./shows.service");
const { getPool } = require("../config/db");

class AdminService {
  static async createShow(data) {
    return ShowsService.createShow(data);
  }

  static async updateShow(id, data) {
    return ShowsService.updateShow(id, data);
  }

  static async getSalesReport() {
    const pool = await getPool();
    const [rows] = await pool.query(`
      SELECT 
        DATE(b.booking_time) AS date,
        COUNT(t.id) AS tickets_sold
      FROM bookings b
      JOIN tickets t ON t.booking_id = b.id
      WHERE b.status = 'paid'
      GROUP BY DATE(b.booking_time)
      ORDER BY date DESC
    `);
    return rows;
  }


  static async getRevenueReport() {
    const pool = await getPool();
    const [rows] = await pool.query(`
      SELECT 
        s.id AS show_id,
        s.title,
        s.show_datetime,
        SUM(t.price) AS revenue
      FROM tickets t
      JOIN bookings b ON b.id = t.booking_id
      JOIN shows s ON s.id = b.show_id
      WHERE b.status = 'paid'
      GROUP BY s.id
      ORDER BY revenue DESC
    `);
    return rows;
  }

  static async getHallLoadReport() {
    const pool = await getPool();
    const [rows] = await pool.query(`
      SELECT 
        h.name AS hall,
        s.show_datetime,
        COUNT(CASE WHEN ss.status='booked' THEN 1 END) AS booked,
        COUNT(*) AS total,
        ROUND(
          COUNT(CASE WHEN ss.status='booked' THEN 1 END) / COUNT(*) * 100, 2
        ) AS load_percent
      FROM show_seats ss
      JOIN shows s ON s.id = ss.show_id
      JOIN halls h ON h.id = s.hall_id
      GROUP BY s.id
      ORDER BY s.show_datetime DESC
    `);
    return rows;
  }
}

module.exports = AdminService;
