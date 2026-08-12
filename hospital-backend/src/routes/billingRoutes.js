const express = require('express');
const { getBills, getBillById, createBill, payBill } = require('../controllers/billingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getBills);
router.post('/', createBill);
router.get('/:id', getBillById);
router.put('/:id/pay', payBill);

module.exports = router;
