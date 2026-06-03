import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    recordType: {
      type: String,
      enum: ['Lab Result', 'Prescription', 'X-Ray', 'Surgery Report', 'Discharge Summary', 'Other'],
      required: true
    },
    title: { type: String, required: true },
    description: String,
    fileAttachment: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    isConfidential: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('MedicalRecord', medicalRecordSchema);
