const express = require('express');
const { signupTeamLeader, getAllTeamLeaders, deleteTeamLeader } = require('../Controllers/TeamLeaderController');

const TeamLeaderRouter = express.Router();

TeamLeaderRouter.post('/team-leader/signup', signupTeamLeader);
TeamLeaderRouter.get('/get-team-leader', getAllTeamLeaders);
TeamLeaderRouter.delete('/delete-team-leader', deleteTeamLeader);

module.exports = TeamLeaderRouter;
