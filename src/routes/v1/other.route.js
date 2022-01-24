const express = require("express");
const passport = require("passport");
require("dotenv").config();
const redis = require("../../config/redis.js");

const router = express.Router();

router.post("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const userId = req.user._id.toString();
  const token = req.headers.authorization.split(" ")[1];

  const fromBlackListedJWTs = await redis.get(userId);
  if (fromBlackListedJWTs === token) {
    res.status(401).json({ success: false, message: "unauthorized JWT" });
  } else {
    res.status(200).send("done");
  }
});

module.exports = router;
