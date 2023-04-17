const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const db = {}

db.mongoose = mongoose;

db.user = require('./user.model')
db.patient = require('./patient.model')
db.doctor = require('./doctor.model')
db.patient_data = require('./patient.data.model')

module.exports = db