import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
  const user = await User.findById(decoded.id).select('-password');
  if (!user || !user.isActive) return res.status(401).json({ message: 'User inactive or missing' });
  req.user = user;
  next();
});
