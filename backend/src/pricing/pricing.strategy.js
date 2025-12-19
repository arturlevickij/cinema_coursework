class PricingStrategy {
  /**
   * 
   * @param {Array<{seatId: number, seat: object}>} seatsData
   * @returns {number} baseTotal
   */
  calculateBaseTotal(seatsData) {
    throw new Error("calculateBaseTotal() must be implemented");
  }
}

module.exports = PricingStrategy;
