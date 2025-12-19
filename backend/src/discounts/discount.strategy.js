class DiscountStrategy {
  apply(price) {
    throw new Error("apply() must be implemented");
  }
}

module.exports = DiscountStrategy;
