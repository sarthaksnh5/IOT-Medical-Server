const mongoose = require('mongoose')

const Doctor = mongoose.model(
    "Doctor",
    new mongoose.Schema({
        user: Object,
        mobile_num: String      
    })
)

module.exports = Doctor;