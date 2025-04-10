const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    fieldExcutiveId:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "FieldExcutive"
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// Create the model
const FieldModel = mongoose.model('Field', fieldSchema);

module.exports = FieldModel;
