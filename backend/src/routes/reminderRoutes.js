const express = require("express");
const {
  getAllReminders,
  createReminder,
  toggleReminder,
  deleteReminder,
  getPersonalizedReminder,
} = require("../controllers/reminderController");

const router = express.Router();

router.get("/", getAllReminders);
router.post("/", createReminder);
router.patch("/:id/toggle", toggleReminder);
router.delete("/:id", deleteReminder);
router.post("/personalized", getPersonalizedReminder);

module.exports = router;
