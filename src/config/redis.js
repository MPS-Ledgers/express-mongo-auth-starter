const { createClient } = require("redis");
require("dotenv").config();

let client;
(async () => {
  const url = process.env.REDIS_URL;
  client = createClient({ url: url });

  client.on("error", (err) => console.log("Redis Client ", err));
  client.on("connect", () => console.log("Redis Connected!"));

  await client.connect();
})();

module.exports = client;
