const jwt = require("jsonwebtoken");
const { JWT_PRIVATE } = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");

//this is the middleware
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in.." });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_PRIVATE, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "You must be logged in.." });
    }
    const { _id } = payload;
    User.findById(_id).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
};
