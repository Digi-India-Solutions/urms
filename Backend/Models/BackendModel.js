const mongoose = require('mongoose');

const backendSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    backendId: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Backend"
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// Create the model
const BackendModel = mongoose.model('Backend', backendSchema);

module.exports = BackendModel;
