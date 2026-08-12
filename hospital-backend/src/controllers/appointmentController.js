const { Op } = require('sequelize');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Bill = require('../models/Bill');

exports.getAppointments = async (req, res, next) => {
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

    const appointments = await Appointment.findAll({
      where: query,
      include: [
        { model: Patient, attributes: ['name', 'gender', 'phone', 'dateOfBirth', 'bloodGroup'] },
        { model: Doctor, attributes: ['name', 'department', 'specialization', 'consultationFee'] }
      ],
      order: [['date', 'ASC']]
    });

    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

exports.getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: Patient },
        { model: Doctor }
      ]
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};

exports.createAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, slot, notes } = req.body;
    let { patientId } = req.body;

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ where: { userId: req.user.id } });
      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }
      patientId = patient.id;
    }

    if (!patientId || !doctorId || !date || !slot) {
      return res.status(400).json({ message: 'Please provide patientId, doctorId, date, and slot' });
    }

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const existing = await Appointment.findOne({
      where: {
        doctorId,
        date,
        slot,
        status: { [Op.ne]: 'Cancelled' }
      }
    });
    if (existing) {
      return res.status(400).json({ message: 'This slot is already booked for this doctor on this day' });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      slot,
      notes,
      consultationFee: doctor.consultationFee
    });

    const total = doctor.consultationFee;
    await Bill.create({
      patientId,
      items: [{
        description: `Consultation Fee - Dr. ${doctor.name}`,
        amount: total,
        quantity: 1
      }],
      subTotal: total,
      grandTotal: total,
      status: 'Unpaid'
    });

    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};
