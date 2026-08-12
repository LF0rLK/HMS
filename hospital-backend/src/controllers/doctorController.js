const Doctor = require('../models/Doctor');
const User = require('../models/User');

exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.findAll({
      include: [{ model: User, attributes: ['username', 'email'] }]
    });
    res.status(200).json(doctors);
  } catch (error) {
    next(error);
  }
};

exports.getDoctorsByDepartment = async (req, res, next) => {
  try {
    const doctors = await Doctor.findAll({
      where: { department: req.params.dept },
      include: [{ model: User, attributes: ['username', 'email'] }]
    });
    res.status(200).json(doctors);
  } catch (error) {
    next(error);
  }
};

exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['username', 'email'] }]
    });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    next(error);
  }
};
