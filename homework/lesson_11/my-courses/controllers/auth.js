import { ErrorResponse } from '../utils/errorResponse.js';
import { UserModel } from '../models/UserModel.js';
import { sendEmail } from '../utils/sendEmail.js';

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Create user
    const user = new UserModel({
      name,
      email,
      password,
    });
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (e) {
    res.send(e);
  }
};

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for the user
  const user = await UserModel.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('User does not exist', 401));
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid password', 401));
  }

  sendTokenResponse(user, 200, res);
};

// @desc      Logout user & clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
export const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};

// @desc      Get current user
// @route     GET /api/v1/auth/me
// @access    Private
export const getMe = async (req, res) => {
  const userId = req.user._id;
  const user = await UserModel.findById(userId);
  res.status(200).json({
    success: true,
    data: user,
  });
};

// @desc      Forgot password
// @route     GET /api/v1/auth/forgot-password
// @access    Public
export const forgotPassword = async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    next(new ErrorResponse('There is no user with that email', 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/auth/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorResponse(`Email could not be sent: ${err.message}`, 500),
    );
  }
};

// @desc      Reset password
// @route     PUT /api/v1/auth/reset-password
// @access    Public
export const resetPassword = async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await UserModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
};

// @desc      Update user details
// @route     PUT /api/v1/auth/update-details
// @access    Private
export const updateDetails = async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await UserModel.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
};

// @desc      Update user password
// @route     PUT /api/v1/auth/update-password
// @access    Private
export const updatePassword = async (req, res, next) => {
  const user = await UserModel.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Wrong password', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
};

// Get token from model, create cookie and response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJWT();

  // const day = 24 * 60 * 60 * 1000;
  // const expires = new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * day);
  // const options = {
  //   expires,
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  // };

  res
    .status(statusCode)
    // .cookie('token', token, options)
    .json({ success: true, token });
};
