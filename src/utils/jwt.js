const jwt = require("jsonwebtoken");

const issueJWT = (user, SECRET_KEY) => {
  const _id = user._id;
  const expiresIn = "1d";
  const payload = {
    sub: _id,
    iat: Date.now(),
  };
  
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: expiresIn,
  });
  const jwtToken = "Bearer " + token;

  const jwtObject = { token: jwtToken, expiresIn: expiresIn };
  return jwtObject;
};

module.exports = issueJWT;
