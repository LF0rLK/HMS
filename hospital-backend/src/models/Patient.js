const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Patient = sequelize.define('Patient', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bloodGroup: {
    type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
  },
  allergies: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  medicalHistory: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

Patient.associate = (models) => {
  Patient.belongsTo(models.User, { foreignKey: 'userId' });
  Patient.hasMany(models.Appointment, { foreignKey: 'patientId' });
  Patient.hasMany(models.Prescription, { foreignKey: 'patientId' });
  Patient.hasMany(models.LabTest, { foreignKey: 'patientId' });
  Patient.hasMany(models.Bill, { foreignKey: 'patientId' });
};

module.exports = Patient;
