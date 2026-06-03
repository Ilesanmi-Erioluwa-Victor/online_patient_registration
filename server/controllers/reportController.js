import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';
import AuditLog from '../models/AuditLog.js';
import Consultation from '../models/Consultation.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import { reportPdf } from '../utils/pdfGenerator.js';

export const summary = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (req.user.role === 'doctor') {
    const [myAppointments, todaysAppointments, pendingAppointments, consultations, patientRows] = await Promise.all([
      Appointment.countDocuments({ doctor: req.user._id }),
      Appointment.countDocuments({ doctor: req.user._id, scheduledDate: { $gte: today, $lt: tomorrow } }),
      Appointment.countDocuments({ doctor: req.user._id, status: 'Pending' }),
      Consultation.countDocuments({ doctor: req.user._id }),
      Consultation.distinct('patient', { doctor: req.user._id })
    ]);
    return res.json({
      myAppointments,
      todaysAppointments,
      pendingAppointments,
      consultations,
      patientsSeen: patientRows.length
    });
  }

  if (req.user.role === 'receptionist') {
    const [registeredPatients, todaysAppointments, pendingAppointments] = await Promise.all([
      Patient.countDocuments({ isActive: true, registeredBy: req.user._id }),
      Appointment.countDocuments({ scheduledDate: { $gte: today, $lt: tomorrow } }),
      Appointment.countDocuments({ status: 'Pending' })
    ]);
    return res.json({ registeredPatients, todaysAppointments, pendingAppointments });
  }

  if (req.user.role === 'nurse') {
    const [totalPatients, todaysAppointments, consultations] = await Promise.all([
      Patient.countDocuments({ isActive: true }),
      Appointment.countDocuments({ scheduledDate: { $gte: today, $lt: tomorrow } }),
      Consultation.countDocuments()
    ]);
    return res.json({ totalPatients, todaysAppointments, consultations });
  }

  const [totalPatients, totalStaff, consultations, todaysAppointments, pendingAppointments] = await Promise.all([
    Patient.countDocuments({ isActive: true }),
    User.countDocuments({ isActive: true }),
    Consultation.countDocuments(),
    Appointment.countDocuments({ scheduledDate: { $gte: today, $lt: tomorrow } }),
    Appointment.countDocuments({ status: 'Pending' })
  ]);
  res.json({ totalPatients, totalStaff, consultations, todaysAppointments, pendingAppointments });
});

export const patientsByMonth = asyncHandler(async (req, res) => {
  const since = new Date();
  since.setMonth(since.getMonth() - 5, 1);
  const rows = await Patient.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { '_id.y': 1, '_id.m': 1 } }
  ]);
  res.json(rows.map((r) => ({ month: `${r._id.m}/${r._id.y}`, count: r.count })));
});

export const genderBreakdown = asyncHandler(async (req, res) => {
  res.json(await Patient.aggregate([{ $match: { isActive: true } }, { $group: { _id: '$gender', count: { $sum: 1 } } }]));
});

export const bloodGroupStats = asyncHandler(async (req, res) => {
  res.json(await Patient.aggregate([{ $match: { isActive: true } }, { $group: { _id: '$bloodGroup', count: { $sum: 1 } } }]));
});

export const appointmentStats = asyncHandler(async (req, res) => {
  res.json(await Appointment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]));
});

export const exportPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({ isActive: true }).sort('lastName');
  reportPdf(res, 'Patients Report', patients.map((p) => `${p.patientID} - ${p.firstName} ${p.lastName} - ${p.phone}`));
});

export const exportRecords = asyncHandler(async (req, res) => {
  const [patients, consultations] = await Promise.all([Patient.countDocuments(), Consultation.countDocuments()]);
  reportPdf(res, 'Records Report', [`Patients: ${patients}`, `Consultations: ${consultations}`]);
});

export const auditLogs = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Number(req.query.limit || 10), 50);
  const filter = {};
  if (req.query.action) filter.action = new RegExp(req.query.action, 'i');
  if (req.query.user) filter.performedBy = req.query.user;
  if (req.query.from || req.query.to) {
    filter.timestamp = {};
    if (req.query.from) filter.timestamp.$gte = new Date(req.query.from);
    if (req.query.to) filter.timestamp.$lte = new Date(req.query.to);
  }
  const [items, total] = await Promise.all([
    AuditLog.find(filter).populate('performedBy', 'fullName role').sort('-timestamp').skip((page - 1) * limit).limit(limit),
    AuditLog.countDocuments(filter)
  ]);
  res.json({ items, page, pages: Math.ceil(total / limit), total });
});
