import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendMail } from '../config/email.js';

const publicUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  phone: user.phone,
  department: user.department,
  profileImage: user.profileImage
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user || !user.isActive || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ user: publicUser(user), token: generateToken(user) });
});

export const logout = (req, res) => res.json({ message: 'Logged out. Clear token on client.' });

export const me = (req, res) => res.json(req.user);

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();
    const link = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${rawToken}`;
    await sendMail({ to: user.email, subject: 'Password reset', html: `<p>Reset your password: <a href="${link}">${link}</a></p>` });
  }
  res.json({ message: 'If that email exists, a reset link has been sent.' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ message: 'Password reset successful' });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  ['fullName', 'phone', 'department'].forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });
  if (req.file) user.profileImage = `/uploads/${req.file.filename}`;
  if (req.body.currentPassword && req.body.newPassword) {
    if (!(await user.matchPassword(req.body.currentPassword))) return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = req.body.newPassword;
  }
  await user.save();
  res.json(publicUser(user));
});
