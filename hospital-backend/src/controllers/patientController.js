const Patient = require('../models/Patient');
const User = require('../models/User');

exports.getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.findAll({
      include: [{ model: User, attributes: ['username', 'email'] }]
    });
    res.status(200).json(patients);
  } catch (error) {
    next(error);
  }
};

exports.getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['username', 'email'] }]
    });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (req.user.role === 'patient' && patient.userId !== Number(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to view this patient profile' });
    }

    res.status(200).json(patient);
  } catch (error) {
    next(error);
  }
};

exports.updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (req.user.role === 'patient' && patient.userId !== Number(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    await patient.update(req.body);
    res.status(200).json(patient);
  } catch (error) {
    next(error);
  }
};
