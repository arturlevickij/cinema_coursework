const express = require("express");
const AuthController = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);


router.get("/me", auth, AuthController.me);

module.exports = router;
