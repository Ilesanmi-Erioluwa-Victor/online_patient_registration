import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { sendMail } from '../config/email.js';
import { writeAudit } from '../utils/audit.js';

export const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  await writeAudit(req, 'Created staff user', 'User', user._id);
  await sendMail({
    to: user.email,
    subject: 'Hospital account created',
    html: `<p>Your staff account has been created. Temporary password: <strong>${req.body.password}</strong></p>`
  });
  res.status(201).json({ ...user.toObject(), password: undefined });
});

export const listUsers = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.search) {
    const regex = new RegExp(req.query.search, 'i');
    query.$or = [{ fullName: regex }, { role: regex }, { department: regex }];
  }
  const users = await User.find(query).select('-password').sort('role fullName');
  res.json(users);
});

export const listDoctors = asyncHandler(async (req, res) => {
  const doctors = await User.find({ role: 'doctor', isActive: true }).select('fullName department');
  res.json(doctors);
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  ['fullName', 'email', 'role', 'phone', 'department', 'isActive'].forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });
  if (req.body.password) user.password = req.body.password;
  await user.save();
  await writeAudit(req, 'Updated staff user', 'User', user._id);
  res.json({ ...user.toObject(), password: undefined });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select('-password');
  await writeAudit(req, 'Deactivated staff user', 'User', user._id);
  res.json(user);
});
