const jwt = require("jsonwebtoken");

const { secret } = require("../config/env").jwt;

exports.generateToken = (user) => {
  return jwt.sign({ id: user.id }, secret, {
    expiresIn: "1h",
  });
};

exports.verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};
exports.decodeToken = (token) => {
  return jwt.decode(token);
};
