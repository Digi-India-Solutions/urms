const express = require('express');
const { signupField, getField, deleteField, loginField, sendOtp, verifyOtp, resetPassword } = require('../Controllers/FieldController');



const FieldRouter = express.Router();

FieldRouter.post('/field/signup', signupField);
FieldRouter.post('/login-field-excutive', loginField);
FieldRouter.get('/get-field-record', getField);
FieldRouter.delete('/delete-field-record', deleteField);
FieldRouter.post("/send-otp", sendOtp)
FieldRouter.post("/verify-otp", verifyOtp)
FieldRouter.post("/reset-password", resetPassword)

module.exports = FieldRouter;
