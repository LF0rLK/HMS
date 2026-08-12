const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const Medicine = require('./Medicine');
const Appointment = require('./Appointment');
const Prescription = require('./Prescription');
const LabTest = require('./LabTest');
const Bill = require('./Bill');

const models = {
  User,
  Patient,
  Doctor,
  Medicine,
  Appointment,
  Prescription,
  LabTest,
  Bill,
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = models;
