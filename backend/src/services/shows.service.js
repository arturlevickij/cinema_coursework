// backend/src/services/shows.service.js
const ShowRepository = require("../repositories/show.repository");
const { getPool } = require("../config/db");


class ShowsService {
  static async getAllShows() {
    return ShowRepository.getAll();
  }

  static async getShowById(id) {
    return ShowRepository.findById(id);
  }

  static async getSeatsForShow(id) {
    return ShowRepository.getSeatsForShow(id);
  }

  static async createShow(data) {
    const pool = await getPool();
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [res] = await conn.query(
        `INSERT INTO shows (title, description, duration_minutes, hall_id, show_datetime)
        VALUES (?, ?, ?, ?, ?)`,
        [
          data.title,
          data.description,
          data.duration_minutes,
          data.hall_id,
          data.show_datetime
        ]
      );

      const showId = res.insertId;

      const [seats] = await conn.query(
        `SELECT id FROM seats WHERE hall_id = ?`,
        [data.hall_id]
      );

      if (!seats.length) {
        throw new Error("No seats found for this hall");
      }

      for (const seat of seats) {
        await conn.query(
          `INSERT INTO show_seats (show_id, seat_id)
          VALUES (?, ?)`,
          [showId, seat.id]
        );
      }

      await conn.commit();
      return { id: showId };

    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async updateShow(id, data) {
    const existingSeats = await ShowRepository.hasSeats(id);

    if (existingSeats && data.hall_id) {
      throw new Error("Cannot change hall for show with existing seats");
    }

    return ShowRepository.update(id, data);
  }

  static deleteShow(id) {
    return ShowRepository.remove(id);
  }

}

module.exports = ShowsService;
