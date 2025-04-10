const mongoose = require("mongoose")

const ResidencySchema = new mongoose.Schema({
    taskID:{
        type:mongoose.Schema.ObjectId,
        ref:"Task",
        required:true
    },
    addressTraced: {
        type: String,
        required: true
    },
    reasonOfUntraced: {
        type: String
    },
    requireToTrace: {
        type: String
    },
    callingResponse: {
        type: String
    },
    lastLocatation: {
        type: String
    },
    otherObservation: {
        type: String
    },
    remark: {
        type: String
    },
    metneighboreFirst: {
        type: String
    },
    metneighboreSecond: {
        type: String
    },
    detailsharebyneighboore: {
        type: String
    },
    applicantresiding: {
        type: String
    },
    metPersonname: {
        type: String
    },
    whoisthat: {
        type: String
    },
    applicantresidingconfirmation: {
        type: String
    },
    totalFloor: {
        type: String
    },
    addressExitWhichfloor: {
        type: String
    },
    relationwithapplicant: {
        type: String
    },
    tenureofresidence: {
        type: String
    },
    ownershipofresidence: {
        type: String
    },
    rentamount: {
        type: String
    },
    landlordname: {
        type: String
    },
    builddescription: {
        type: String
    },
    applicantresidingwhichfloor: {
        type: String
    },
    landarea: {
        type: String
    },
    localityofaddress: {
        type: String
    },
    documentbymetperson: {
        type: String
    },
    totalfamilymember: {
        type: String
    },
    numberofearnrs: {
        type: String
    },
    addressImage: {
        type: [String]
    },
    images: {
        type: [String]
    },
    latlang:{
        type:String
    }
})


const ResidencyModel = mongoose.model("Residency", ResidencySchema)

module.exports = ResidencyModel