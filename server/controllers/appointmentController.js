import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import { sendMail } from '../config/email.js';
import { writeAudit } from '../utils/audit.js';

const appointmentFilter = (query) => {
  const filter = {};
  if (query.doctor) filter.doctor = query.doctor;
  if (query.status) filter.status = query.status;
  if (query.from || query.to) {
    filter.scheduledDate = {};
    if (query.from) filter.scheduledDate.$gte = new Date(query.from);
    if (query.to) filter.scheduledDate.$lte = new Date(query.to);
  }
  return filter;
};

const notifyStatus = async (appointment) => {
  if (!['Confirmed', 'Cancelled'].includes(appointment.status)) return;
  const [patient, doctor] = await Promise.all([Patient.findById(appointment.patient), User.findById(appointment.doctor)]);
  if (!patient?.email) return;
  await sendMail({
    to: patient.email,
    subject: `Appointment ${appointment.status}`,
    html: `<p>Your appointment on ${appointment.scheduledDate.toLocaleString('en-GB')} with Dr. ${doctor?.fullName || ''} was ${appointment.status.toLowerCase()}.</p>`
  });
};

export const createAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.create({ ...req.body, createdBy: req.user._id });
  await writeAudit(req, 'Created appointment', 'Appointment', appointment._id);
  await notifyStatus(appointment);
  res.status(201).json(appointment);
});

export const listAppointments = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Number(req.query.limit || 10), 50);
  const filter = appointmentFilter(req.query);
  const [items, total] = await Promise.all([
    Appointment.find(filter).populate('patient', 'firstName lastName patientID phone').populate('doctor', 'fullName department').sort('scheduledDate').skip((page - 1) * limit).limit(limit),
    Appointment.countDocuments(filter)
  ]);
  res.json({ items, page, pages: Math.ceil(total / limit), total });
});

export const getAppointment = asyncHandler(async (req, res) => {
  const item = await Appointment.findById(req.params.id).populate('patient doctor createdBy');
  if (!item) return res.status(404).json({ message: 'Appointment not found' });
  res.json(item);
});

export const updateAppointment = asyncHandler(async (req, res) => {
  const item = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  await writeAudit(req, 'Updated appointment', 'Appointment', item._id);
  await notifyStatus(item);
  res.json(item);
});

export const deleteAppointment = asyncHandler(async (req, res) => {
  const item = await Appointment.findByIdAndUpdate(req.params.id, { status: 'Cancelled' }, { new: true });
  await writeAudit(req, 'Cancelled appointment', 'Appointment', item._id);
  await notifyStatus(item);
  res.json({ message: 'Appointment cancelled' });
});
