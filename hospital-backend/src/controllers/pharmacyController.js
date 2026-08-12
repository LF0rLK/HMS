const Medicine = require('../models/Medicine');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Bill = require('../models/Bill');

// Inventory
exports.getMedicines = async (req, res, next) => {
  try {
    const medicines = await Medicine.findAll({ order: [['name', 'ASC']] });
    res.status(200).json(medicines);
  } catch (error) {
    next(error);
  }
};

exports.addMedicine = async (req, res, next) => {
  try {
    const { name, category, manufacturer, stock, price, unit, expiryDate } = req.body;
    const medicine = await Medicine.create({
      name,
      category,
      manufacturer,
      stock,
      price,
      unit,
      expiryDate: expiryDate || new Date('2028-12-31')
    });
    res.status(201).json(medicine);
  } catch (error) {
    next(error);
  }
};

exports.updateMedicineStock = async (req, res, next) => {
  try {
    const { stock } = req.body;
    const medicine = await Medicine.findByPk(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    medicine.stock = stock;
    await medicine.save();
    res.status(200).json(medicine);
  } catch (error) {
    next(error);
  }
};

// Prescriptions
exports.getPrescriptions = async (req, res, next) => {
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

    const prescriptions = await Prescription.findAll({
      where: query,
      include: [
        { model: Patient, attributes: ['name', 'gender', 'phone'] },
        { model: Doctor, attributes: ['name', 'department'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const response = await Promise.all(
      prescriptions.map(async (prescription) => {
        const plain = prescription.toJSON();
        const medicineDetails = await Promise.all(
          (plain.medicines || []).map(async (item) => {
            const med = await Medicine.findByPk(item.medicineId, {
              attributes: ['id', 'name', 'price', 'unit']
            });
            return {
              ...item,
              medicine: med ? med.toJSON() : null
            };
          })
        );
        return {
          ...plain,
          medicines: medicineDetails
        };
      })
    );

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.createPrescription = async (req, res, next) => {
  try {
    const { patientId, appointmentId, diagnosis, medicines, notes } = req.body;

    let doctorId;
    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (doctor) {
      doctorId = doctor.id;
    } else {
      doctorId = req.body.doctorId;
    }

    if (!patientId || !diagnosis || !medicines || medicines.length === 0 || !doctorId) {
      return res.status(400).json({ message: 'Please provide patientId, doctorId, diagnosis, and medicines' });
    }

    const prescription = await Prescription.create({
      patientId,
      appointmentId,
      doctorId,
      diagnosis,
      medicines,
      notes,
      status: 'Prescribed'
    });

    res.status(201).json(prescription);
  } catch (error) {
    next(error);
  }
};

exports.dispensePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findByPk(req.params.id);
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });

    if (prescription.status === 'Dispensed') {
      return res.status(400).json({ message: 'Prescription has already been dispensed' });
    }

    const billItems = [];
    let pharmacyTotal = 0;

    for (const item of prescription.medicines || []) {
      const med = await Medicine.findByPk(item.medicineId);
      if (med) {
        const quantityToDispense = 10;
        if (med.stock >= quantityToDispense) {
          med.stock -= quantityToDispense;
          await med.save();
        }

        const cost = med.price * quantityToDispense;
        billItems.push({
          description: `Dispensed Medicine - ${med.name} (${quantityToDispense} ${med.unit}s)`,
          amount: cost,
          quantity: 1
        });
        pharmacyTotal += cost;
      }
    }

    prescription.status = 'Dispensed';
    await prescription.save();

    if (billItems.length > 0) {
      await Bill.create({
        patientId: prescription.patientId,
        items: billItems,
        subTotal: pharmacyTotal,
        grandTotal: pharmacyTotal,
        status: 'Unpaid'
      });
    }

    res.status(200).json({ prescription, billCreated: billItems.length > 0 });
  } catch (error) {
    next(error);
  }
};
