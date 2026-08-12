const express = require('express');
const authRoutes = require('./authRoutes');
const patientRoutes = require('./patientRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const doctorRoutes = require('./doctorRoutes');
const billingRoutes = require('./billingRoutes');
const labTestRoutes = require('./labTestRoutes');
const pharmacyRoutes = require('./pharmacyRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/doctors', doctorRoutes);
router.use('/billing', billingRoutes);
router.use('/lab-tests', labTestRoutes);
router.use('/pharmacy', pharmacyRoutes);

module.exports = router;
