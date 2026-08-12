const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Bill = sequelize.define('Bill', {
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false
  },
  subTotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  discount: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  tax: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  grandTotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Unpaid', 'Paid'),
    allowNull: false,
    defaultValue: 'Unpaid'
  },
  paymentMethod: {
    type: DataTypes.ENUM('Cash', 'Card', 'Insurance', 'Online'),
    allowNull: true,
    defaultValue: null
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  billingDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

Bill.associate = (models) => {
  Bill.belongsTo(models.Patient, { foreignKey: 'patientId' });
};

module.exports = Bill;
