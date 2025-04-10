const { createTeam, getAllTeams, deleteTeam } = require("../Controllers/TeamController")

const TeamRouter = require("express").Router()

TeamRouter.post("/create-team", createTeam)
TeamRouter.get("/get-team", getAllTeams)
TeamRouter.delete("/delete-team/:id", deleteTeam)

module.exports = TeamRouter