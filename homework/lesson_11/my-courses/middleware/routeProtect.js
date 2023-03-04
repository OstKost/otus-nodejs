import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../utils/errorResponse.js';
import { UserModel } from '../models/UserModel.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer
    token = req.headers.authorization.split(' ')[1];
  }

  // Set token from cookie
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    req.user = await UserModel.findById(userId);
    next();
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
};