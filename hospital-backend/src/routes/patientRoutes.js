const express = require('express');
const { getPatients, getPatientById, updatePatient } = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Admins, doctors, receptionists, and pharmacists can view all patients
router.get('/', roleMiddleware('admin', 'doctor', 'receptionist', 'pharmacist'), getPatients);

// Patient or authorized staff can view/update profile
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);

module.exports = router;
