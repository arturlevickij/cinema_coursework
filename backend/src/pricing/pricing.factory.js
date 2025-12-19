const SimplePricingStrategy = require("./simplePricing.strategy");
const DynamicPricingStrategy = require("./dynamicPricing.strategy");

class PricingFactory {
  /**
   * @param {"simple"|"dynamic"} type
   * @param {object} showInfo
   */
  static create(type, showInfo) {
    switch (type) {
      case "dynamic":
        return new DynamicPricingStrategy(showInfo);
      case "simple":
      default:
        return new SimplePricingStrategy();
    }
  }
}

module.exports = PricingFactory;
