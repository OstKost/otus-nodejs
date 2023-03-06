import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../utils/errorResponse.js';

// Protect routes
export const studentProtect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) next();

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    req.studentId = decoded?.id;
    next();
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
};
