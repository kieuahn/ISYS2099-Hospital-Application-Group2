const mongoose = require('mongoose');
const { Schema } = mongoose;

const treatmentDataSchema = new Schema({
  treatment_id: {
    type: Number,
    required: true,
    unique: true, // Unique treatment_id to link with MySQL Treatment table
  },
  patient_note:{
    type: String,
    trim: true,
  },
  doctor_notes: {
    type: String,
    trim: true,
  },
  diagnostic_images: [{
    url: {
      type: String,
      required: true,
    }
  }],
  lab_results: {
    type: String
  },
  prescriptions: {
    type: String,
  }
});

const TreatmentData = mongoose.model('TreatmentData', treatmentDataSchema);

module.exports = TreatmentData;
