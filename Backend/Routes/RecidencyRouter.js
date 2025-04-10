
const { createResidency, getAllResidencies } = require("../Controllers/RecidencyController")
const upload = require("../Middleware/Multer")

const recidenceRouter = require("express").Router()

recidenceRouter.post("/send-recidency-record", upload.fields([
    { name: "addressImage", maxCount: 2 },
    { name: "images", maxCount: 4 }
]), createResidency)
recidenceRouter.get("/get-recidency-record", getAllResidencies)



module.exports = recidenceRouter