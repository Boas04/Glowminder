const express = require("express");
const { getCurrentWeatherHandler } = require("../controllers/weatherController");

const router = express.Router();

router.get("/current", getCurrentWeatherHandler);

module.exports = router;
