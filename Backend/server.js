const dotenv = require("dotenv")
dotenv.config()
const express = require("express")

const app = express()

const cors = require("cors")
const { connectDatabase } = require("./DB/ConnectDataBase")
const SignupRouter = require("./Routes/SignupRoutes")
const officeRouter = require("./Routes/OfficeRouter")
const recidenceRouter = require("./Routes/RecidencyRouter")
const TeamLeaderRouter = require("./Routes/TeamLeaderRoute")
const TeamRouter = require("./Routes/TeamRoute")
const BackendRouter = require("./Routes/BackendRoute")
const FieldRouter = require("./Routes/FieldRoute")
const TaskRouter = require("./Routes/taskRoutes")
const RemarkRouter = require("./Routes/RemarkRoute")

app.use(cors())
app.use(express.json())
app.set(express.static("Public"))
app.use("/Public", express.static("Public"))

app.get("/", (req, res) => {
    res.send("Server Is Running")
})

app.use("/api", SignupRouter)
app.use("/api", officeRouter)
app.use("/api", recidenceRouter)
app.use("/api", TeamLeaderRouter)
app.use("/api", TeamRouter)
app.use("/api", BackendRouter)
app.use("/api", FieldRouter)
app.use("/api", TaskRouter)
app.use("/api", RemarkRouter)



app.listen(process.env.PORT, () => {
    console.log(`Server Is Running At ${process.env.PORT}`)
})

connectDatabase()