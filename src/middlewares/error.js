//Import error constructor class
const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  //some status codes
  if (err.code === 11000) {
    const message = "Duplicate Fiedl Value Enter";
    error = new ErrorResponse(message, 400);
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.messaje);
    error = new ErrorResponse(message, 400);
  }
  //If status code and message is not send, then Server Error with status code of 500
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
