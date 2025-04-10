const mongoose = require("mongoose")

const remarkSchema = new mongoose.Schema({
    resformId: {
        type: mongoose.Schema.ObjectId,
        ref: "Residency"
    },
    officeformId: {
        type: mongoose.Schema.ObjectId,
        ref: "Office"
    },
    remark: {
        type: String,
        required: true
    },
    addressImage: {
        type: [String]
    },
    images: {
        type: [String]
    }
})

const RemarkModel = mongoose.model("Remark", remarkSchema)

module.exports = RemarkModel