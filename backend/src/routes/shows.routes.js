const express = require("express");
const router = express.Router();
const ShowsController = require("../controllers/shows.controller");


router.get("/", ShowsController.list);
router.get("/:id", ShowsController.details);
router.get("/:id/seats", ShowsController.seats);


router.post("/", ShowsController.create);
router.put("/:id", ShowsController.update);
router.delete("/:id", ShowsController.remove);

module.exports = router;
