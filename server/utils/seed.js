import Appointment from "../models/Appointment.js";
import Consultation from "../models/Consultation.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";

export const seedDatabase = async () => {
  if (await User.countDocuments()) return;
  const users = await User.create([
    {
      fullName: "System Administrator",
      email: "admin@hospital.com",
      password: "Admin@1234",
      role: "admin",
      department: "ICT",
    },
    {
      fullName: "Dr. Ada Okafor",
      email: "doctor@hospital.com",
      password: "Doctor@1234",
      role: "doctor",
      department: "General Medicine",
    },
    {
      fullName: "Nurse Grace Efe",
      email: "nurse@hospital.com",
      password: "Nurse@1234",
      role: "nurse",
      department: "Outpatient",
    },
    {
      fullName: "Mary Reception",
      email: "reception@hospital.com",
      password: "Reception@1234",
      role: "receptionist",
      department: "Front Desk",
    },
  ]);
  const [admin, doctor, , receptionist] = users;
  const patients = await Patient.create([
    {
      patientID: `PAT-${new Date().getFullYear()}-00001`,
      firstName: "Samuel",
      lastName: "Johnson",
      dateOfBirth: "1988-04-12",
      gender: "Male",
      bloodGroup: "O+",
      phone: "08030000001",
      email: "samuel@example.com",
      address: { street: "12 Market Road", city: "Oghara", state: "Delta" },
      nextOfKin: {
        name: "Rita Johnson",
        relationship: "Wife",
        phone: "08030000011",
      },
      allergies: ["Penicillin"],
      chronicConditions: ["Hypertension"],
      registeredBy: receptionist._id,
    },
    {
      patientID: `PAT-${new Date().getFullYear()}-00002`,
      firstName: "Blessing",
      lastName: "Ewoma",
      dateOfBirth: "1995-09-25",
      gender: "Female",
      bloodGroup: "A-",
      phone: "08030000002",
      email: "blessing@example.com",
      address: { street: "5 College Lane", city: "Oghara", state: "Delta" },
      nextOfKin: {
        name: "Tega Ewoma",
        relationship: "Brother",
        phone: "08030000012",
      },
      allergies: [],
      chronicConditions: [],
      registeredBy: receptionist._id,
    },
    {
      patientID: `PAT-${new Date().getFullYear()}-00003`,
      firstName: "Peter",
      lastName: "Okoro",
      dateOfBirth: "1979-01-10",
      gender: "Male",
      bloodGroup: "B+",
      phone: "08030000003",
      email: "peter@example.com",
      address: { street: "22 Hospital Road", city: "Sapele", state: "Delta" },
      nextOfKin: {
        name: "Helen Okoro",
        relationship: "Sister",
        phone: "08030000013",
      },
      allergies: ["Sulphur"],
      chronicConditions: ["Diabetes"],
      registeredBy: admin._id,
    },
  ]);
  await Consultation.create([
    {
      patient: patients[0]._id,
      doctor: doctor._id,
      date: new Date(),
      chiefComplaint: "Headache and dizziness",
      diagnosis: "Elevated blood pressure",
      treatment: "Lifestyle review and medication",
      vitalSigns: { bloodPressure: "150/95", pulse: "84" },
      prescription: [
        {
          drug: "Amlodipine",
          dosage: "5mg",
          frequency: "Daily",
          duration: "30 days",
        },
      ],
    },
    {
      patient: patients[2]._id,
      doctor: doctor._id,
      date: new Date(),
      chiefComplaint: "Routine diabetic review",
      diagnosis: "Type 2 diabetes follow-up",
      treatment: "Continue medication and diet plan",
      vitalSigns: { weight: "82kg", spO2: "98%" },
    },
  ]);
  await Appointment.create([
    {
      patient: patients[0]._id,
      doctor: doctor._id,
      scheduledDate: new Date(Date.now() + 86400000),
      reason: "Blood pressure review",
      status: "Pending",
      createdBy: receptionist._id,
    },
    {
      patient: patients[1]._id,
      doctor: doctor._id,
      scheduledDate: new Date(Date.now() + 172800000),
      reason: "General consultation",
      status: "Confirmed",
      createdBy: receptionist._id,
    },
  ]);
  console.log("Seed data created");
};
