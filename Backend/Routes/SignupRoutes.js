const { createAccount, getRecord, getSingleRecord, deleteRecord, login, sendOtp, verifyOtp, resetPassword } = require("../Controllers/SignupController")

const SignupRouter = require("express").Router()

SignupRouter.post("/sign-up", createAccount)
SignupRouter.get("/get-all-users", getRecord)
SignupRouter.get("/get-single-user/:id", getSingleRecord)
SignupRouter.delete("/delete-user/:id", deleteRecord)
// SignupRouter.post("/log-in", login)
SignupRouter.post("/send-otp", sendOtp)
SignupRouter.post("/verify-otp", verifyOtp)
SignupRouter.post("/reset-password", resetPassword)

module.exports = SignupRouter