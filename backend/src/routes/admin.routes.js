const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/admin.controller");
const auth = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/admin.middleware");


router.post("/show", auth, adminOnly, AdminController.createShow);
router.put("/show/:id", auth, adminOnly, AdminController.updateShow);


router.get("/reports/sales", auth, adminOnly, AdminController.getSalesReport);
router.get("/reports/revenue", auth, adminOnly, AdminController.getRevenueReport);
router.get("/reports/load", auth, adminOnly, AdminController.getHallLoadReport);

module.exports = router;
