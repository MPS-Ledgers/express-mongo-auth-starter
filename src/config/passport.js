const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/userSchema.js");
require("dotenv").config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY_JWT,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, (jwtPayload, done) => {
      console.log("from passport: ", jwtPayload);

      User.findOne({ _id: jwtPayload.sub }, (err, user) => {
        if (err) return done(err, false);

        if (user) return done(null, user);
        else return done(null, false);
      });
    })
  );
};
