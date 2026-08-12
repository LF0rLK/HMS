const LabTest = require('../models/LabTest');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Bill = require('../models/Bill');

exports.getLabTests = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ where: { userId: req.user.id } });
      if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
      query.patientId = patient.id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
      query.doctorId = doctor.id;
    }

    const tests = await LabTest.findAll({
      where: query,
      include: [
        { model: Patient, attributes: ['name', 'gender', 'phone'] },
        { model: Doctor, attributes: ['name', 'department'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(tests);
  } catch (error) {
    next(error);
  }
};

exports.createLabTest = async (req, res, next) => {
  try {
    const { patientId, testName } = req.body;
    let doctorId;
    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (doctor) {
      doctorId = doctor.id;
    } else {
      doctorId = req.body.doctorId;
    }

    if (!patientId || !testName || !doctorId) {
      return res.status(400).json({ message: 'Please provide patientId, doctorId and testName' });
    }

    const test = await LabTest.create({
      patientId,
      doctorId,
      testName,
      status: 'Requested'
    });

    const testCost = 800;
    await Bill.create({
      patientId,
      items: [{
        description: `Laboratory Test - ${testName}`,
        amount: testCost,
        quantity: 1
      }],
      subTotal: testCost,
      grandTotal: testCost,
      status: 'Unpaid'
    });

    res.status(201).json(test);
  } catch (error) {
    next(error);
  }
};

exports.completeLabTest = async (req, res, next) => {
  try {
    const { results, filePath } = req.body;
    const test = await LabTest.findByPk(req.params.id);

    if (!test) {
      return res.status(404).json({ message: 'Lab test not found' });
    }

    test.status = 'Completed';
    test.results = results || 'Normal';
    test.filePath = filePath || '';
    test.labStaffId = req.user.id;
    test.completedDate = new Date();
    await test.save();

    res.status(200).json(test);
  } catch (error) {
    next(error);
  }
};
