const express = require("express");
const {
	getCurrentWeatherHandler,
	getWeatherLogs,
	getWeatherLogById,
} = require("../controllers/weatherController");

const router = express.Router();

router.get("/current", getCurrentWeatherHandler);
router.get("/logs", getWeatherLogs);
router.get("/logs/:id", getWeatherLogById);

module.exports = router;
