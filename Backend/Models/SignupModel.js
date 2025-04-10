const mongoose = require("mongoose")

const SignupSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "User"
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
    }
}, { timestamps: true })

const SignupModel = mongoose.model("Signup", SignupSchema)

module.exports = SignupModel