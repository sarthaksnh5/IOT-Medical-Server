const mongoose = require('mongoose')

const Patient_Data = mongoose.model(
    "Patient_Data",
    new mongoose.Schema({
        patient: Object,
        heart_rate: String,
        temperature: String,
        spo2: String,
        created_at: {type: Date, default: Date.now },        
    })
)

module.exports = Patient_Data;