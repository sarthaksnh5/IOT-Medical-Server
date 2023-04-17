const mongoose = require('mongoose')

const Patient = mongoose.model(
    "Patient",
    new mongoose.Schema({
        user: Object,
        mobile_num: String,
        doctor: Object       
    })
)

module.exports = Patient;