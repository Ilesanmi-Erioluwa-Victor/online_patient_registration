import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  { street: String, city: String, state: String, country: { type: String, default: 'Nigeria' } },
  { _id: false }
);

const nextOfKinSchema = new mongoose.Schema(
  { name: String, relationship: String, phone: String },
  { _id: false }
);

const patientSchema = new mongoose.Schema(
  {
    patientID: { type: String, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    address: addressSchema,
    nextOfKin: nextOfKinSchema,
    photo: String,
    allergies: [String],
    chronicConditions: [String],
    registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

patientSchema.virtual('age').get(function age() {
  if (!this.dateOfBirth) return undefined;
  const today = new Date();
  let years = today.getFullYear() - this.dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())) years -= 1;
  return years;
});

patientSchema.set('toJSON', { virtuals: true });
patientSchema.index({ firstName: 'text', lastName: 'text', patientID: 'text', phone: 'text' });

export default mongoose.model('Patient', patientSchema);
