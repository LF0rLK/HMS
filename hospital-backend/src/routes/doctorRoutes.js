const express = require('express');
const { getDoctors, getDoctorById, getDoctorsByDepartment } = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getDoctors);
router.get('/department/:dept', getDoctorsByDepartment);
router.get('/:id', getDoctorById);

module.exports = router;
