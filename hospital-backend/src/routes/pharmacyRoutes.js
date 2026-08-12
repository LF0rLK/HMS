const express = require('express');
const { getMedicines, addMedicine, updateMedicineStock, getPrescriptions, createPrescription, dispensePrescription } = require('../controllers/pharmacyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Medicine Inventory
router.get('/medicines', getMedicines);
router.post('/medicines', addMedicine);
router.put('/medicines/:id/stock', updateMedicineStock);

// Prescriptions (for doctor to write, patient to see, pharmacist to dispense)
router.get('/prescriptions', getPrescriptions);
router.post('/prescriptions', createPrescription);
router.put('/prescriptions/:id/dispense', dispensePrescription);

module.exports = router;
