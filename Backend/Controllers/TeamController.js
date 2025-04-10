const teamModel = require("../Models/TeamNameModel");

const createTeam = async (req, res) => {
    try {
        let { teamName } = req.body;
        if (!teamName) {
            return res.status(400).json({
                success: false,
                message: "Team Name is Required"
            })
        }
        // Convert the team name to uppercase and remove extra spaces
        teamName = teamName.toUpperCase().replace(/\s+/g, ' ').trim();

        const existingTeam = await teamModel.findOne({ teamName });
        if (existingTeam) {
            return res.status(400).json({ message: "Team name already exists" });
        }

        // Create new team if it doesn't exist
        const newTeam = new teamModel({ teamName });
        const savedTeam = await newTeam.save();

        // Return the created team
        res.status(200).json({
            success: true,
            message: "Team created successfully",
            data: savedTeam,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
};


// Get All Teams
const getAllTeams = async (req, res) => {
    try {
        const teams = await teamModel.find(); // Fetch all teams
        if (!teams) {
            return res.status(404).json({
                success: false,
                message: "Team Not Found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Teams fetched successfully",
            data: teams
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete a Team by ID
const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const existingTeam = await teamModel.findById(id);
        if (!existingTeam) {
            return res.status(404).json({ message: "Team not found" });
        }
        await teamModel.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Team deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
};
module.exports = { createTeam, getAllTeams, deleteTeam };
