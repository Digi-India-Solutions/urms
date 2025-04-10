// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    assignDate: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: true,
    },
    product: {
        type: String,
        required: true,
    },
    applicantName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    trigger: {
        type: String,
        required: true,
    },
    verifierNameOrId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Pending",
    }
}, { timestamps: true });

// Create the model
const TaskModel = mongoose.model('Task', taskSchema);

module.exports = TaskModel;
