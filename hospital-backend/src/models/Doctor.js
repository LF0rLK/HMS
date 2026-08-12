const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Doctor = sequelize.define('Doctor', {
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
  department: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  availability: {
    type: DataTypes.JSON,
    allowNull: true
  },
  consultationFee: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 500
  }
}, {
  timestamps: true
});

Doctor.associate = (models) => {
  Doctor.belongsTo(models.User, { foreignKey: 'userId' });
  Doctor.hasMany(models.Appointment, { foreignKey: 'doctorId' });
  Doctor.hasMany(models.Prescription, { foreignKey: 'doctorId' });
  Doctor.hasMany(models.LabTest, { foreignKey: 'doctorId' });
};

module.exports = Doctor;
