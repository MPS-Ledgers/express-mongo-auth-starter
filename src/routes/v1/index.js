const express = require("express");
const authRoutes = require("./auth.route");
const otherRoutes = require("./other.route");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/other", otherRoutes);

module.exports = router;
