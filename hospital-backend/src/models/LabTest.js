const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const LabTest = sequelize.define('LabTest', {
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  testName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Requested', 'Completed'),
    allowNull: false,
    defaultValue: 'Requested'
  },
  requestDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  results: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  labStaffId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  completedDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

LabTest.associate = (models) => {
  LabTest.belongsTo(models.Patient, { foreignKey: 'patientId' });
  LabTest.belongsTo(models.Doctor, { foreignKey: 'doctorId' });
};

module.exports = LabTest;
