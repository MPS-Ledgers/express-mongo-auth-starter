const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes/v1/index.js");
const mongoose = require("mongoose");
const passport = require("passport");

dotenv.config();
const app = express();

require("./config/database.js");
require("./config/passport.js")(passport);
require("./config/redis.js");

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/v1", routes);

module.exports = app;
