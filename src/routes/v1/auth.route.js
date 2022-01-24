const express = require("express");
const User = require("../../models/userSchema.js");
const passport = require("passport");
const issueJWT = require("../../utils/jwt.js");
const redis = require("../../config/redis.js");
require("dotenv").config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY_JWT;

router.post("/login", async (req, res) => {
  const email = req.body.email,
    password = req.body.password;

  // console.log(email, password);
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).json({ success: false, message: "no such user" });
    } else if (user.password === password) {
      const jwtObject = issueJWT(user, SECRET_KEY);
      const userId = user._id.toString();
      redis.del(userId);
      res
        .status(201)
        .json({ success: true, token: jwtObject.token, expiresIn: jwtObject.expiresIn });
    } else {
      res.status(401).json({ success: false, message: "incorrect password" });
    }
  } catch (error) {
    res.status(500);
  }
});

router.post("/logout", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const userId = req.user._id.toString();
  const token = req.headers.authorization.split(" ")[1];
  const expireIn = Date.now() + 24 * 60 * 60 * 1000;
  try {
    await redis.set(userId, token, { PX: expireIn });
    // const savedToken = await redis.get(userId);
    // console.log(savedToken);
    res.status(201).json({ success: true, message: "logged out" });
  } catch (err) {
    res.status(500);
  }
});

router.post("/register", async (req, res) => {
  const email = req.body.email,
    password = req.body.password;

  // console.log(email, password);
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const newUser = new User({ email: email, password: password });
      try {
        const savedUser = await newUser.save();
        const jwtObject = issueJWT(savedUser, SECRET_KEY);
        res
          .status(201)
          .json({ success: true, token: jwtObject.token, expiresIn: jwtObject.expiresIn });
      } catch (error) {
        // console.log(user);
        res.status(500).json({ success: false, error: error });
      }
    } else {
      res.status(409).json({ success: false, message: "user already exists" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

module.exports = router;
