const express = require('express');
const { signupBacken, getBackends, deleteBackend, login } = require('../Controllers/BackendController');


const BackendRouter = express.Router();

BackendRouter.post('/backend/signup', signupBacken);
BackendRouter.post('/log-in', login);
BackendRouter.get('/get-backend-record', getBackends);
BackendRouter.delete('/delete-backend-record', deleteBackend);

module.exports = BackendRouter;
