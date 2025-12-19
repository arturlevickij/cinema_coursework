const DiscountStrategy = require("./discount.strategy");

class FixedDiscount extends DiscountStrategy {
  constructor(amount) {
    super();
    this.amount = amount;
  }

  apply(price) {
    const result = price - this.amount;
    return result > 0 ? result : 0;
  }
}

module.exports = FixedDiscount;
