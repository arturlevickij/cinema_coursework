const NoDiscount = require("./noDiscount.strategy");
const PercentDiscount = require("./percentDiscount.strategy");
const FixedDiscount = require("./fixedDiscount.strategy");
const { getPool } = require("../config/db");

class DiscountFactory {
  static async create(discountId) {
    if (!discountId) return new NoDiscount();

    const pool = await getPool();
    const [[discount]] = await pool.query(
      "SELECT * FROM discounts WHERE id=? AND is_active=TRUE",
      [discountId]
    );

    if (!discount) return new NoDiscount();

    switch (discount.discount_type) {
      case "percent":
        return new PercentDiscount(discount.discount_percent);
      case "fixed":
        return new FixedDiscount(discount.discount_percent);
      default:
        return new NoDiscount();
    }
  }
}

module.exports = DiscountFactory;
