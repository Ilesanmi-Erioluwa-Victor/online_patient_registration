import asyncHandler from 'express-async-handler';
import Patient from '../models/Patient.js';
import { sendMail } from '../config/email.js';
import { generatePatientID } from '../utils/generatePatientID.js';
import { patientSummaryPdf } from '../utils/pdfGenerator.js';
import { writeAudit } from '../utils/audit.js';

const patientFilter = (query) => {
  const filter = query.includeInactive === 'true' ? {} : { isActive: true };
  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filter.$or = [{ firstName: regex }, { lastName: regex }, { patientID: regex }, { phone: regex }];
  }
  if (query.gender) filter.gender = query.gender;
  if (query.bloodGroup) filter.bloodGroup = query.bloodGroup;
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }
  return filter;
};

export const createPatient = asyncHandler(async (req, res) => {
  const { firstName, lastName, dateOfBirth, phone } = req.body;
  const duplicate = await Patient.findOne({
    isActive: true,
    $or: [{ phone }, { firstName, lastName, dateOfBirth: new Date(dateOfBirth) }]
  });
  if (duplicate) return res.status(409).json({ message: 'Possible duplicate patient found' });
  const patient = await Patient.create({
    ...req.body,
    patientID: await generatePatientID(),
    registeredBy: req.user._id
  });
  await writeAudit(req, 'Registered new patient', 'Patient', patient._id);
  if (patient.email) {
    await sendMail({
      to: patient.email,
      subject: 'Patient registration confirmed',
      html: `<p>Your patient ID is <strong>${patient.patientID}</strong>. Registered on ${patient.createdAt.toLocaleDateString('en-GB')}.</p>`
    });
  }
  res.status(201).json(patient);
});

export const listPatients = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Number(req.query.limit || 10), 50);
  const filter = patientFilter(req.query);
  const [items, total] = await Promise.all([
    Patient.find(filter).populate('registeredBy', 'fullName role').sort('-createdAt').skip((page - 1) * limit).limit(limit),
    Patient.countDocuments(filter)
  ]);
  res.json({ items, page, pages: Math.ceil(total / limit), total });
});

export const getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id).populate('registeredBy', 'fullName role');
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json(patient);
});

export const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  await writeAudit(req, 'Updated patient profile', 'Patient', patient._id);
  res.json(patient);
});

export const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  await writeAudit(req, 'Soft deleted patient profile', 'Patient', patient._id);
  res.json({ message: 'Patient deactivated' });
});

export const patientSummary = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  patientSummaryPdf(res, patient);
});

export const uploadPhoto = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, { photo: `/uploads/${req.file.filename}` }, { new: true });
  await writeAudit(req, 'Uploaded patient photo', 'Patient', patient._id);
  res.json(patient);
});
