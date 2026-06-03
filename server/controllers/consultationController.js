import asyncHandler from 'express-async-handler';
import Consultation from '../models/Consultation.js';
import { writeAudit } from '../utils/audit.js';

export const createConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.create({ ...req.body, doctor: req.body.doctor || req.user._id });
  await writeAudit(req, 'Created consultation', 'Consultation', consultation._id);
  res.status(201).json(consultation);
});

export const consultationsByPatient = asyncHandler(async (req, res) => {
  const items = await Consultation.find({ patient: req.params.id }).populate('doctor', 'fullName department').sort('-date');
  res.json(items);
});

export const getConsultation = asyncHandler(async (req, res) => {
  const item = await Consultation.findById(req.params.id).populate('patient doctor');
  if (!item) return res.status(404).json({ message: 'Consultation not found' });
  res.json(item);
});

export const updateConsultation = asyncHandler(async (req, res) => {
  const item = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  await writeAudit(req, 'Updated consultation', 'Consultation', item._id);
  res.json(item);
});

export const deleteConsultation = asyncHandler(async (req, res) => {
  const item = await Consultation.findByIdAndDelete(req.params.id);
  await writeAudit(req, 'Deleted consultation', 'Consultation', item._id);
  res.json({ message: 'Consultation deleted' });
});
