const Bill = require('../models/Bill');
const Patient = require('../models/Patient');

exports.getBills = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ where: { userId: req.user.id } });
      if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
      query.patientId = patient.id;
    }

    const bills = await Bill.findAll({
      where: query,
      include: [{ model: Patient, attributes: ['name', 'email', 'phone'] }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(bills);
  } catch (error) {
    next(error);
  }
};

exports.getBillById = async (req, res, next) => {
  try {
    const bill = await Bill.findByPk(req.params.id, {
      include: [{ model: Patient }]
    });
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.status(200).json(bill);
  } catch (error) {
    next(error);
  }
};

exports.createBill = async (req, res, next) => {
  try {
    const { patientId, items, discount, tax } = req.body;

    if (!patientId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Please provide patientId and bill items' });
    }

    const subTotal = items.reduce((sum, item) => sum + (item.amount * (item.quantity || 1)), 0);
    const discAmt = discount || 0;
    const taxAmt = tax || 0;
    const grandTotal = subTotal - discAmt + taxAmt;

    const bill = await Bill.create({
      patientId,
      items,
      subTotal,
      discount: discAmt,
      tax: taxAmt,
      grandTotal,
      status: 'Unpaid'
    });

    res.status(201).json(bill);
  } catch (error) {
    next(error);
  }
};

exports.payBill = async (req, res, next) => {
  try {
    const { paymentMethod, transactionId } = req.body;
    const bill = await Bill.findByPk(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    bill.status = 'Paid';
    bill.paymentMethod = paymentMethod || 'Cash';
    bill.transactionId = transactionId || `TXN-${Date.now()}`;
    await bill.save();

    res.status(200).json(bill);
  } catch (error) {
    next(error);
  }
};
