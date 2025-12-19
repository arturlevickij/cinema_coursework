const express = require("express");
const { getPool } = require("../config/db");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      "SELECT id, discount_name, discount_percent FROM discounts WHERE is_active = TRUE"
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Помилка завантаження знижок" });
  }
});

module.exports = router;
