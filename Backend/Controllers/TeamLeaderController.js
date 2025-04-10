const bcrypt = require('bcrypt');
const TeamLeader = require('../Models/TeamleaderModel');

// Controller function for team leader signup
const signupTeamLeader = async (req, res) => {
    const { name, email, phoneNumber, backend, password, teamLeaderId } = req.body; // Changed 'team' to 'backend'

    // Check if all required fields are provided
    if (!name) {
        return res.status(400).json({ message: 'Please fill in the name' });
    }
    if (!email) {
        return res.status(400).json({ message: 'Please fill in the email' });
    }
    if (!phoneNumber) {
        return res.status(400).json({ message: 'Please fill in the phone number' });
    }
    if (!backend) {
        return res.status(400).json({ message: 'Please select a backend' }); // Updated error message
    }
    if (!password) {
        return res.status(400).json({ message: 'Please fill in the password' });
    }
    if (!teamLeaderId) {
        return res.status(400).json({ message: 'Please fill in the Team Leader Id' });
    }

    try {
        // Check if email already exists
        const existingEmail = await TeamLeader.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Check if phone number already exists
        const existingPhoneNumber = await TeamLeader.findOne({ phoneNumber });
        if (existingPhoneNumber) {
            return res.status(400).json({ message: 'Phone number already exists' });
        }

        const existingteamLeaderId = await TeamLeader.findOne({ teamLeaderId });
        if (existingteamLeaderId) {
            return res.status(400).json({ message: 'Team LeaderId already exists' });
        }


        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new team leader instance
        const newTeamLeader = new TeamLeader({
            name,
            email,
            phoneNumber,
            teamLeaderId,
            backend, // Save backend ID from request body
            password: hashedPassword,
        });

        // Save the new team leader to the database
        await newTeamLeader.save();

        // Send success response
        res.status(200).json({ message: 'Team leader created successfully!' }); // Changed status to 201
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function to get all team leaders
const getAllTeamLeaders = async (req, res) => {
    try {
        const teamLeaders = await TeamLeader.find().populate('backend'); // Populate backend details

        if (!teamLeaders.length) { // Check for an empty array
            return res.status(404).json({
                success: false,
                message: "No records found"
            });
        }

        res.status(200).json({
            success: true,
            message: 'Records found',
            data: teamLeaders
        });
    } catch (error) {
        console.error('Error fetching team leaders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function to delete a team leader
const deleteTeamLeader = async (req, res) => {
    const { id } = req.params; // Assuming ID is passed in the URL

    try {
        const deletedTeamLeader = await TeamLeader.findByIdAndDelete(id);
        if (!deletedTeamLeader) {
            return res.status(404).json({ message: 'Team leader not found' });
        }

        res.status(200).json({ message: 'Team leader deleted successfully' });
    } catch (error) {
        console.error('Error deleting team leader:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    signupTeamLeader,
    getAllTeamLeaders,
    deleteTeamLeader
};
