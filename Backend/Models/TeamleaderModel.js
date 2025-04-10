const mongoose = require('mongoose');

const teamLeaderSchema = new mongoose.Schema({
    name: {
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
    teamLeaderId: {
        type: String,
        required: true,
    },
    backend: {
        type: mongoose.Schema.ObjectId,
        ref: "Backend",
        required: true
    },
    role: {
        type: String,
        default: "Team Leader"
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// Create the model
const TeamLeader = mongoose.model('TeamLeader', teamLeaderSchema);

module.exports = TeamLeader;
