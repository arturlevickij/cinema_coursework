const DiscountStrategy = require("./discount.strategy");

class PercentDiscount extends DiscountStrategy {
  constructor(percent) {
    super();
    this.percent = percent;
  }

  apply(price) {
    return price * (1 - this.percent / 100);
  }
}

module.exports = PercentDiscount;
