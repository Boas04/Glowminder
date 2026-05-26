const express = require("express");
const { getReminderHandler } = require("../controllers/aiController");

const router = express.Router();

router.post("/reminder", getReminderHandler);

module.exports = router;
