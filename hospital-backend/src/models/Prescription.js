const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Prescription = sequelize.define('Prescription', {
  appointmentId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  medicines: {
    type: DataTypes.JSON,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Prescribed', 'Dispensed'),
    allowNull: false,
    defaultValue: 'Prescribed'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

Prescription.associate = (models) => {
  Prescription.belongsTo(models.Patient, { foreignKey: 'patientId' });
  Prescription.belongsTo(models.Doctor, { foreignKey: 'doctorId' });
};

module.exports = Prescription;
