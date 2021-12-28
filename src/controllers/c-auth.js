const User = require("../models/Users");
const ErrorResponse = require("../utils/errorResponse");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (await User.findOne({ username: username })) {
      return next(new ErrorResponse("Username already in use", 401));
    }
    const user = await User.create({
      username,
      email,
      password,
    });
    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(
      new ErrorResponse("Please, enter your email and password", 400)
    );
  }
  try {
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return next(new ErrorResponse("Invalid credentials"), 401);
    }
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials"), 401);
    }
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.forgotpass = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorResponse("Please enter your email", 400));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetURL = `http://localhost:${process.env.FRONT_PORT}/resetpass/${resetToken}`;

    const message = ` 
    <h1>Reset Password </h1>
    <p> A password reset event has been triggered. </p>
    <p> The password reset window is limited to ten minutes. If you don't reset your password within ten minutes, you will nedd to submit a new request. </p>
    <p> To complete the password reset process, visit the following link: </p>
    <a href=${resetURL} clicktracking=off> ${resetURL} </a>`;
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset",
        text: message,
      });
      res.status(200).json({
        success: true,
        message: "Email sent",
      });
    } catch (error) {
      console.log(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();
      return next(new ErrorResponse("Email cannot be sent", 500));
    }
  } catch (err) {
    next(err);
  }
};

exports.resetpass = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ErrorResponse("token invalid", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password reset succesful",
      token: user.getSignedToken(),
    });
  } catch (err) {
    NEXT(err);
  }
};

//if user is authenticated, returns Token
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({
    success: true,
    token,
  });
};
