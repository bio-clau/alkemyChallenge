//Authentication of user with JWT

const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/Users");

exports.protect = async (req, res, next) => {
  let token;
  //if header.authorization exists ans starts with Bearer. Then separate the token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorResponse("No user found with this ID", 404));
    }
    req.user = user;
    next();
  } catch (err) {
    next(new ErrorResponse("Not authorized to accees this Route", 401));
  }
};
