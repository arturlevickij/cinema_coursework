const PricingStrategy = require("./pricing.strategy");

class DynamicPricingStrategy extends PricingStrategy {
  constructor(showInfo) {
    super();
    this.showInfo = showInfo;
  }

  calculateBaseTotal(seatsData) {
    let total = 0;
    for (const { seat } of seatsData) {
      total += 100 * seat.price_multiplier;
    }

    const showDate = new Date(this.showInfo.show_datetime);
    const hour = showDate.getHours();
    if (hour >= 18) {
      total *= 1.1;
    }

    if (this.showInfo.occupancy && this.showInfo.occupancy > 0.7) {
      total *= 1.1;
    }

    return total;
  }
}

module.exports = DynamicPricingStrategy;
