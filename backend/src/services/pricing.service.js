const DiscountFactory = require("../discounts/discount.factory");
const PricingFactory = require("../pricing/pricing.factory");
const { getPool } = require("../config/db");

class PricingService {
  /**
   * @param {number[]} seatIds
   * @param {number|null} discountId
   * @param {"simple"|"dynamic"} pricingType
   * @param {number} showId
   */
  static async calculateTotal(seatIds, discountId, pricingType = "simple", showId = null) {
    const pool = await getPool();


    const seatsData = [];
    for (const seatId of seatIds) {
      const [[seat]] = await pool.query(
        `
        SELECT s.id, sc.price_multiplier
        FROM seats s
        JOIN seat_categories sc ON s.category_id = sc.id
        WHERE s.id = ?
        `,
        [seatId]
      );
      if (!seat) continue;
      seatsData.push({ seatId, seat });
    }

    if (!seatsData.length) {
      return {
        baseTotal: 0,
        finalTotal: 0,
        discountAmount: 0
      };
    }


    let showInfo = { show_datetime: null, occupancy: null };
    if (showId) {
      const [[show]] = await pool.query(
        `
        SELECT show_datetime FROM shows WHERE id = ?
        `,
        [showId]
      );


      const [[stats]] = await pool.query(
        `
        SELECT 
          SUM(CASE WHEN status = 'booked' THEN 1 ELSE 0 END) AS booked,
          COUNT(*) AS total
        FROM show_seats
        WHERE show_id = ?
        `,
        [showId]
      );

      const occupancy =
        stats && stats.total
          ? stats.booked / stats.total
          : 0;

      showInfo = {
        show_datetime: show?.show_datetime,
        occupancy
      };
    }


    const pricingStrategy = PricingFactory.create(pricingType, showInfo);
    const baseTotal = pricingStrategy.calculateBaseTotal(seatsData);


    const discountStrategy = await DiscountFactory.create(discountId);
    const finalTotal = discountStrategy.apply(baseTotal);

    return {
      baseTotal: Number(baseTotal.toFixed(2)),
      finalTotal: Number(finalTotal.toFixed(2)),
      discountAmount: Number((baseTotal - finalTotal).toFixed(2))
    };
  }
}

module.exports = PricingService;
