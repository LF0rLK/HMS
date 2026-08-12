const { Op } = require('sequelize');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');

// Helper to sign JWT
const signToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role, name, gender, dateOfBirth, phone, address, department, specialization, consultationFee } = req.body;

    // Check if user exists
    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });
    if (userExists) {
      return res.status(400).json({ message: 'Username or Email already registered' });
    }

    // Create User
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'patient',
      name
    });

    // Create corresponding profile
    if (user.role === 'patient') {
      await Patient.create({
        userId: user.id,
        name,
        gender: gender || 'Other',
        dateOfBirth: dateOfBirth || new Date('1990-01-01'),
        phone: phone || `0000000000-${user.id}`,
        email,
        address: address || 'Not Provided'
      });
    } else if (user.role === 'doctor') {
      await Doctor.create({
        userId: user.id,
        name,
        department: department || 'General',
        specialization: specialization || 'General Practitioner',
        phone: phone || 'Not Provided',
        email,
        consultationFee: consultationFee || 500
      });
    }

    const token = signToken(user.id, user.role);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find User
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user.id, user.role);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profile = null;
    if (user.role === 'patient') {
      profile = await Patient.findOne({ where: { userId: user.id } });
    } else if (user.role === 'doctor') {
      profile = await Doctor.findOne({ where: { userId: user.id } });
    }

    res.status(200).json({
      user,
      profile
    });
  } catch (error) {
    next(error);
  }
};
