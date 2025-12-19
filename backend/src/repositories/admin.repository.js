const db = require("../config/db");

class AdminRepository {
    async createShow(name, description, duration, date, time, hallId) {
        const [result] = await db.query(
            `INSERT INTO shows (name, description, duration, date, time, hall_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, description, duration, date, time, hallId]
        );
        return result.insertId;
    }

    async updateShow(id, data) {
        const { name, description, duration, date, time, hall_id } = data;

        await db.query(
            `UPDATE shows 
             SET name=?, description=?, duration=?, date=?, time=?, hall_id=? 
             WHERE id=?`,
            [name, description, duration, date, time, hall_id, id]
        );
    }

    async deleteShow(id) {
        await db.query(`DELETE FROM shows WHERE id = ?`, [id]);
    }

    async createHall(name, rows, seatsPerRow) {
        const [result] = await db.query(
            `INSERT INTO halls (name, rows, seats_per_row)
             VALUES (?, ?, ?)`,
            [name, rows, seatsPerRow]
        );
        return result.insertId;
    }
}

module.exports = new AdminRepository();
