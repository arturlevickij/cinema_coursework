const AdminService = require("../services/admin.service");

class AdminController {
  static async createShow(req, res) {
    try {
      console.log("ADMIN CREATE SHOW BODY ->", req.body);
      const result = await AdminService.createShow(req.body);
      res.status(201).json(result);
    } catch (err) {
      console.error("❌ ADMIN CREATE SHOW ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }

  static async updateShow(req, res) {
    try {
      await AdminService.updateShow(req.params.id, req.body);
      res.json({ success: true });
    } catch (err) {
      console.error("❌ ADMIN UPDATE SHOW ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }


  static async getSalesReport(req, res) {
    const data = await AdminService.getSalesReport();
    res.json(data);
  }

  static async getRevenueReport(req, res) {
    const data = await AdminService.getRevenueReport();
    res.json(data);
  }

  static async getHallLoadReport(req, res) {
    const data = await AdminService.getHallLoadReport();
    res.json(data);
  }
}

module.exports = AdminController;
