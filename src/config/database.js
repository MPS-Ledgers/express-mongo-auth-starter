const mongoose = require("mongoose");

require("dotenv").config();

const devConnection = process.env.MONGO_URI;
const prodConnection = process.env.MONGO_URI_PROD;

if (process.env.NODE_ENV === "production") {
  mongoose.connect(prodConnection);

  mongoose.connection.on("connected", () => {
    console.log("Database connected in production!");
  });
} else {
  mongoose.connect(devConnection);

  mongoose.connection.on("connected", () => {
    console.log("Database connected in development!");
  });
}
