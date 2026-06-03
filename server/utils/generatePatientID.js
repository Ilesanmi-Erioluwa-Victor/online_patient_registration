import Patient from '../models/Patient.js';

export const generatePatientID = async () => {
  const year = new Date().getFullYear();
  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);
  const count = await Patient.countDocuments({ createdAt: { $gte: start, $lt: end } });
  return `PAT-${year}-${String(count + 1).padStart(5, '0')}`;
};
