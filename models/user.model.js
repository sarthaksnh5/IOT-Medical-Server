const mongoose = require('mongoose')

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        created_on: {type: Date, default: Date.now },
        user_type: String,      
    })
)

module.exports = User;