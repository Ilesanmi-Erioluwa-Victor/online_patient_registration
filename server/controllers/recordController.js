import asyncHandler from 'express-async-handler';
import MedicalRecord from '../models/MedicalRecord.js';
import { writeAudit } from '../utils/audit.js';

const canView = (record, user) => !record.isConfidential || ['admin', 'doctor'].includes(user.role);

export const createRecord = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.create({
    ...req.body,
    uploadedBy: req.user._id,
    fileAttachment: req.file ? `/uploads/${req.file.filename}` : undefined
  });
  await writeAudit(req, 'Uploaded medical record', 'MedicalRecord', record._id);
  res.status(201).json(record);
});

export const recordsByPatient = asyncHandler(async (req, res) => {
  const records = await MedicalRecord.find({ patient: req.params.id }).populate('uploadedBy', 'fullName role').sort('-date');
  res.json(records.filter((record) => canView(record, req.user)));
});

export const getRecord = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id).populate('patient uploadedBy');
  if (!record) return res.status(404).json({ message: 'Record not found' });
  if (!canView(record, req.user)) return res.status(403).json({ message: 'Confidential record restricted' });
  res.json(record);
});

export const updateRecord = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!record) return res.status(404).json({ message: 'Record not found' });
  await writeAudit(req, 'Updated medical record', 'MedicalRecord', record._id);
  res.json(record);
});

export const deleteRecord = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findByIdAndDelete(req.params.id);
  if (!record) return res.status(404).json({ message: 'Record not found' });
  await writeAudit(req, 'Deleted medical record', 'MedicalRecord', record._id);
  res.json({ message: 'Record deleted' });
});
