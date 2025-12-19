const PricingStrategy = require("./pricing.strategy");

class SimplePricingStrategy extends PricingStrategy {
  calculateBaseTotal(seatsData) {
    let total = 0;
    for (const { seat } of seatsData) {
      total += 100 * seat.price_multiplier;
    }
    return total;
  }
}

module.exports = SimplePricingStrategy;
