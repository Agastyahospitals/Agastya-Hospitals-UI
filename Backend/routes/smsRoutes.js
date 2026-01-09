
const express = require("express");
const router = express.Router();
const { sendSMS } = require("../controllers/smsController");

// Generic SMS
router.post("/", sendSMS);

module.exports = router;