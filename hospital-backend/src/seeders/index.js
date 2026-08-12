/**
 * ============================================================
 * ONE Hospital Management System — Database Seeder
 * ============================================================
 * Usage: npm run seed
 * Uses SQLite storage configured in .env or defaults to ./hospital.sqlite.
 *
 * Seeds:
 *   - 1 Admin
 *   - 3 Doctors (Cardiology, Pediatrics, Orthopedics)
 *   - 3 Patients
 *   - 1 Receptionist, 1 Pharmacist, 1 Lab-Staff
 *   - 8 Medicines (pharmacy inventory)
 *   - 6 Appointments (various statuses)
 *   - 4 Prescriptions (with medicines)
 *   - 4 Lab Tests (some completed, some pending)
 *   - 3 Bills (paid & unpaid)
 * ============================================================
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');

const { connectDB } = require('../config/database');
const sequelize = require('../config/sequelize');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Medicine = require('../models/Medicine');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const LabTest = require('../models/LabTest');
const Bill = require('../models/Bill');

const seedData = async () => {
  try {
    await connectDB();
    await sequelize.sync({ force: true });
    console.log('\n🌱 Starting ONE HMS database seed...\n');
    console.log('🗑  Reset database schema for seeding.\n');

    // ─── 1. Demo Users for Login Page ─────────────────────────
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@hms.com',
      password: 'password123',
      role: 'admin',
      name: 'HMS System Administrator',
    });
    const doctorDemoUser = await User.create({
      username: 'doctor',
      email: 'doctor@hms.com',
      password: 'password123',
      role: 'doctor',
      name: 'Dr. Demo Doctor',
    });
    const patientDemoUser = await User.create({
      username: 'john_doe',
      email: 'patient@hms.com',
      password: 'password123',
      role: 'patient',
      name: 'John Doe',
    });
    console.log('✅ Seeded demo login users: admin@hms.com, doctor@hms.com, patient@hms.com');

    // ─── 2. Support Staff ────────────────────────────────────
    await User.create({
      username: 'receptionist',
      email: 'receptionist@hms.com',
      password: 'password123',
      role: 'receptionist',
      name: 'Emily Carter',
    });
    await User.create({
      username: 'pharmacist',
      email: 'pharmacist@hms.com',
      password: 'password123',
      role: 'pharmacist',
      name: 'Mark Harris',
    });
    await User.create({
      username: 'labstaff',
      email: 'labstaff@hms.com',
      password: 'password123',
      role: 'lab-staff',
      name: 'Diana Prince',
    });
    console.log('✅ Seeded Receptionist, Pharmacist, Lab Staff');

    // ─── 3. Doctors ──────────────────────────────────────────
    const doc1User = await User.create({
      username: 'dr_sarah_smith',
      email: 'sarah@hms.com',
      password: 'password123',
      role: 'doctor',
      name: 'Dr. Sarah Smith',
    });
    const doctor1 = await Doctor.create({
      userId: doc1User.id,
      name: 'Dr. Sarah Smith',
      department: 'Cardiology',
      specialization: 'Interventional Cardiology',
      phone: '123-456-7890',
      email: 'sarah@hms.com',
      consultationFee: 800,
      availability: [
        { day: 'Monday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'] },
        { day: 'Wednesday', slots: ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'] },
        { day: 'Friday', slots: ['09:00 AM', '09:30 AM', '10:00 AM'] },
      ],
    });

    const doc2User = await User.create({
      username: 'dr_robert_jones',
      email: 'jones@hms.com',
      password: 'password123',
      role: 'doctor',
      name: 'Dr. Robert Jones',
    });
    const doctor2 = await Doctor.create({
      userId: doc2User.id,
      name: 'Dr. Robert Jones',
      department: 'Pediatrics',
      specialization: 'General Pediatrics & Neonatology',
      phone: '987-654-3210',
      email: 'jones@hms.com',
      consultationFee: 600,
      availability: [
        { day: 'Tuesday', slots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] },
        { day: 'Thursday', slots: ['09:00 AM', '09:30 AM', '10:00 AM'] },
      ],
    });

    const doc3User = await User.create({
      username: 'dr_alice_chen',
      email: 'chen@hms.com',
      password: 'password123',
      role: 'doctor',
      name: 'Dr. Alice Chen',
    });
    const doctor3 = await Doctor.create({
      userId: doc3User.id,
      name: 'Dr. Alice Chen',
      department: 'Orthopedics',
      specialization: 'Sports Injury & Joint Reconstruction',
      phone: '555-123-9876',
      email: 'chen@hms.com',
      consultationFee: 900,
      availability: [
        { day: 'Monday', slots: ['02:00 PM', '02:30 PM', '03:00 PM'] },
        { day: 'Friday', slots: ['10:30 AM', '11:00 AM', '11:30 AM'] },
      ],
    });
    console.log('✅ Seeded 3 Doctors');

    // ─── 4. Patients ─────────────────────────────────────────
    const pat1User = patientDemoUser;
    const patient1 = await Patient.create({
      userId: pat1User.id,
      name: 'John Doe',
      gender: 'Male',
      dateOfBirth: new Date('1985-05-15'),
      phone: '555-0199',
      email: 'patient@hms.com',
      address: '742 Evergreen Terrace, Springfield',
      bloodGroup: 'O+',
      allergies: ['Penicillin'],
      medicalHistory: 'Hypertension (diagnosed 2018), managed with medication.',
    });

    const pat2User = await User.create({
      username: 'jane_miller',
      email: 'jane@hms.com',
      password: 'password123',
      role: 'patient',
      name: 'Jane Miller',
    });
    const patient2 = await Patient.create({
      userId: pat2User.id,
      name: 'Jane Miller',
      gender: 'Female',
      dateOfBirth: new Date('1992-11-22'),
      phone: '555-0288',
      email: 'jane@hms.com',
      address: '1 Maple Drive, Portland',
      bloodGroup: 'A+',
      allergies: [],
      medicalHistory: 'Type 2 Diabetes — on Metformin therapy.',
    });

    const pat3User = await User.create({
      username: 'bob_wilson',
      email: 'bob@hms.com',
      password: 'password123',
      role: 'patient',
      name: 'Bob Wilson',
    });
    const patient3 = await Patient.create({
      userId: pat3User.id,
      name: 'Bob Wilson',
      gender: 'Male',
      dateOfBirth: new Date('1975-03-08'),
      phone: '555-0377',
      email: 'bob@hms.com',
      address: '55 Oak Avenue, Denver',
      bloodGroup: 'B-',
      allergies: ['Sulfa', 'NSAIDs'],
      medicalHistory: 'Knee ligament tear (ACL) — post-operative rehabilitation.',
    });
    console.log('✅ Seeded 3 Patients');

    // ─── 5. Medicine Inventory (8 items) ─────────────────────
    const meds = await Medicine.bulkCreate([
      { name: 'Paracetamol 500mg',    category: 'Analgesics',       manufacturer: 'PharmaCorp',   stock: 500, price: 5,   unit: 'Tablet',  expiryDate: new Date('2028-12-01') },
      { name: 'Amoxicillin 250mg',    category: 'Antibiotics',      manufacturer: 'BioLabs',      stock: 200, price: 15,  unit: 'Capsule', expiryDate: new Date('2027-06-15') },
      { name: 'Atorvastatin 10mg',    category: 'Cardiovascular',   manufacturer: 'AstraPharma', stock: 300, price: 25,  unit: 'Tablet',  expiryDate: new Date('2028-03-20') },
      { name: 'Metformin 850mg',      category: 'Antidiabetic',     manufacturer: 'Glucotech',    stock: 450, price: 12,  unit: 'Tablet',  expiryDate: new Date('2029-01-10') },
      { name: 'Cough Syrup 100ml',    category: 'Antitussives',     manufacturer: 'Medicos',      stock: 120, price: 45,  unit: 'Bottle',  expiryDate: new Date('2027-08-30') },
      { name: 'Losartan 50mg',        category: 'Cardiovascular',   manufacturer: 'CardioVita',   stock: 280, price: 30,  unit: 'Tablet',  expiryDate: new Date('2028-09-15') },
      { name: 'Ibuprofen 400mg',      category: 'Analgesics',       manufacturer: 'ReliefMed',    stock: 360, price: 8,   unit: 'Tablet',  expiryDate: new Date('2027-11-30') },
      { name: 'Ciprofloxacin 500mg',  category: 'Antibiotics',      manufacturer: 'GermClear',    stock: 150, price: 22,  unit: 'Tablet',  expiryDate: new Date('2027-05-20') },
    ]);
    console.log('✅ Seeded 8 Medicines');

    // ─── 6. Appointments (6) ─────────────────────────────────
    const appt1 = await Appointment.create({
      patientId: patient1.id,
      doctorId: doctor1.id,
      date: new Date('2026-08-05'),
      slot: '09:00 AM',
      status: 'Approved',
      consultationFee: 800,
      notes: 'Follow-up for elevated blood pressure and chest palpitations.',
    });
    const appt2 = await Appointment.create({
      patientId: patient2.id,
      doctorId: doctor1.id,
      date: new Date('2026-08-06'),
      slot: '09:30 AM',
      status: 'Pending',
      consultationFee: 800,
      notes: 'Routine diabetes management consultation.',
    });
    const appt3 = await Appointment.create({
      patientId: patient3.id,
      doctorId: doctor3.id,
      date: new Date('2026-07-28'),
      slot: '02:00 PM',
      status: 'Completed',
      consultationFee: 900,
      notes: 'Post-ACL surgery follow-up and physiotherapy assessment.',
    });
    const appt4 = await Appointment.create({
      patientId: patient1.id,
      doctorId: doctor2.id,
      date: new Date('2026-08-10'),
      slot: '10:00 AM',
      status: 'Pending',
      consultationFee: 600,
      notes: 'General health checkup for insurance review.',
    });
    const appt5 = await Appointment.create({
      patientId: patient2.id,
      doctorId: doctor2.id,
      date: new Date('2026-07-20'),
      slot: '11:00 AM',
      status: 'Completed',
      consultationFee: 600,
      notes: 'Thyroid panel review and prescription renewal.',
    });
    const appt6 = await Appointment.create({
      patientId: patient3.id,
      doctorId: doctor1.id,
      date: new Date('2026-08-12'),
      slot: '10:30 AM',
      status: 'Approved',
      consultationFee: 800,
      notes: 'Cardiac screening for pre-operative clearance.',
    });
    console.log('✅ Seeded 6 Appointments');

    // ─── 7. Prescriptions (4) ────────────────────────────────
    const rx1 = await Prescription.create({
      patientId: patient1.id,
      doctorId: doctor1.id,
      appointmentId: appt1.id,
      diagnosis: 'Hypertension Grade 1 with Palpitations',
      date: new Date('2026-08-05'),
      status: 'Dispensed',
      medicines: [
        { medicineId: meds[2].id, dosage: '1-0-0', duration: '30 days', instructions: 'Take after breakfast' },
        { medicineId: meds[5].id, dosage: '0-0-1', duration: '30 days', instructions: 'Take before bedtime' },
      ],
      notes: 'Monitor BP twice daily. Return if systolic exceeds 160 mmHg.',
    });

    const rx2 = await Prescription.create({
      patientId: patient2.id,
      doctorId: doctor1.id,
      appointmentId: appt5.id,
      diagnosis: 'Type 2 Diabetes Mellitus — HbA1c 7.8%',
      date: new Date('2026-07-20'),
      status: 'Prescribed',
      medicines: [
        { medicineId: meds[3].id, dosage: '1-0-1', duration: '90 days', instructions: 'Take with meals' },
        { medicineId: meds[0].id, dosage: '0-1-0', duration: '14 days', instructions: 'Take for headaches as needed' },
      ],
      notes: 'Diet: <1800 kcal/day. Fasting glucose target < 130 mg/dL.',
    });

    const rx3 = await Prescription.create({
      patientId: patient3.id,
      doctorId: doctor3.id,
      appointmentId: appt3.id,
      diagnosis: 'Post-ACL Reconstruction — Acute Pain Management',
      date: new Date('2026-07-28'),
      status: 'Dispensed',
      medicines: [
        { medicineId: meds[6].id, dosage: '1-1-1', duration: '7 days', instructions: 'After food. Avoid on empty stomach.' },
      ],
      notes: 'Physiotherapy 3x/week. Avoid weight-bearing for 3 weeks.',
    });

    const rx4 = await Prescription.create({
      patientId: patient1.id,
      doctorId: doctor2.id,
      appointmentId: appt4.id,
      diagnosis: 'Upper Respiratory Tract Infection (URTI)',
      date: new Date('2026-08-10'),
      status: 'Prescribed',
      medicines: [
        { medicineId: meds[1].id, dosage: '1-1-1', duration: '7 days', instructions: 'Complete full course even if symptoms improve' },
        { medicineId: meds[4].id, dosage: '0-1-0', duration: '5 days', instructions: '5ml twice daily after meals' },
        { medicineId: meds[0].id, dosage: '1-0-1', duration: '5 days', instructions: 'For fever & soreness' },
      ],
      notes: 'Hydrate well. Rest. Follow up if fever persists beyond 5 days.',
    });
    console.log('✅ Seeded 4 Prescriptions');

    // ─── 8. Lab Tests (4) ────────────────────────────────────
    await LabTest.create({
      patientId: patient1.id,
      doctorId: doctor1.id,
      testName: 'Lipid Profile Panel',
      requestDate: new Date('2026-08-05'),
      status: 'Completed',
      completedDate: new Date('2026-08-06'),
      results: 'LDL: 142 mg/dL (High), HDL: 38 mg/dL (Low), Total Cholesterol: 218 mg/dL. Statin therapy advised.',
    });

    await LabTest.create({
      patientId: patient2.id,
      doctorId: doctor1.id,
      testName: 'HbA1c (Glycated Hemoglobin)',
      requestDate: new Date('2026-07-20'),
      status: 'Completed',
      completedDate: new Date('2026-07-21'),
      results: 'HbA1c: 7.8% — Above target. Continue Metformin, consider lifestyle modification.',
    });

    await LabTest.create({
      patientId: patient3.id,
      doctorId: doctor3.id,
      testName: 'Complete Blood Count (CBC)',
      requestDate: new Date('2026-08-12'),
      status: 'Requested',
      results: null,
    });

    await LabTest.create({
      patientId: patient1.id,
      doctorId: doctor1.id,
      testName: 'Cardioglobin Enzyme Test',
      requestDate: new Date('2026-08-06'),
      status: 'Requested',
      results: null,
    });
    console.log('✅ Seeded 4 Lab Tests (2 Completed, 2 Pending)');

    // ─── 9. Bills (3) ────────────────────────────────────────
    await Bill.create({
      patientId: patient1.id,
      items: [
        { description: 'Cardiology Consultation Fee — Dr. Sarah Smith', amount: 800 },
        { description: 'Lipid Profile Panel — Pathology Lab', amount: 350 },
        { description: 'Atorvastatin 10mg × 30 tabs', amount: 750 },
        { description: 'Losartan 50mg × 30 tabs', amount: 900 },
      ],
      subTotal: 2800,
      discount: 200,
      tax: 0,
      grandTotal: 2600,
      status: 'Paid',
      paymentMethod: 'Card',
      billingDate: new Date('2026-08-05'),
    });

    await Bill.create({
      patientId: patient2.id,
      items: [
        { description: 'Cardiology Consultation Fee — Dr. Sarah Smith', amount: 800 },
        { description: 'HbA1c Lab Test — Pathology Lab', amount: 500 },
        { description: 'Metformin 850mg × 90 tabs', amount: 1080 },
      ],
      subTotal: 2380,
      discount: 0,
      tax: 0,
      grandTotal: 2380,
      status: 'Unpaid',
      paymentMethod: null,
      billingDate: new Date('2026-07-20'),
    });

    await Bill.create({
      patientId: patient3.id,
      items: [
        { description: 'Orthopedics Consultation — Dr. Alice Chen', amount: 900 },
        { description: 'Ibuprofen 400mg × 21 tabs', amount: 168 },
      ],
      subTotal: 1068,
      discount: 68,
      tax: 0,
      grandTotal: 1000,
      status: 'Paid',
      paymentMethod: 'Cash',
      billingDate: new Date('2026-07-28'),
    });
    console.log('✅ Seeded 3 Bills (2 Paid, 1 Unpaid)');

    console.log('\n🎉 ONE HMS seed completed successfully!\n');
    console.log('─────────────────────────────────────────────');
    console.log('Default Login Credentials');
    console.log('─────────────────────────────────────────────');
    console.log('  Admin        admin@hms.com      / password123');
    console.log('  Doctor       doctor@hms.com     / password123');
    console.log('  Doctor       jones@hms.com      / password123');
    console.log('  Doctor       chen@hms.com       / password123');
    console.log('  Receptionist receptionist@hms.com / password123');
    console.log('  Pharmacist   pharmacist@hms.com / password123');
    console.log('  Lab Staff    labstaff@hms.com   / password123');
    console.log('  Patient      patient@hms.com    / password123');
    console.log('  Patient      jane@hms.com       / password123');
    console.log('  Patient      bob@hms.com        / password123');
    console.log('─────────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

seedData();
