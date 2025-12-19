const DiscountStrategy = require("./discount.strategy");

class NoDiscount extends DiscountStrategy {
  apply(price) {
    return price;
  }
}

module.exports = NoDiscount;
