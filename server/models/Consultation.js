import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  { drug: String, dosage: String, frequency: String, duration: String },
  { _id: false }
);

const vitalSignsSchema = new mongoose.Schema(
  { temperature: String, bloodPressure: String, pulse: String, weight: String, height: String, spO2: String },
  { _id: false }
);

const consultationSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    chiefComplaint: { type: String, required: true },
    diagnosis: String,
    treatment: String,
    prescription: [prescriptionSchema],
    vitalSigns: vitalSignsSchema,
    notes: String,
    followUpDate: Date
  },
  { timestamps: true }
);

export default mongoose.model('Consultation', consultationSchema);
