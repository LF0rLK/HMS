const express = require('express');
const { getLabTests, createLabTest, completeLabTest } = require('../controllers/labTestController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getLabTests);
router.post('/', createLabTest);
router.put('/:id/complete', completeLabTest);

module.exports = router;
