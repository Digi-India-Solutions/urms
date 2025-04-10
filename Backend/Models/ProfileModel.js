const mongoose = require("mongoose")

const officeSchema = new mongoose.Schema({
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
    yourLocatation: {
        type: String
    },
    otherObservation: {
        type: String
    },
    remark: {
        type: String
    },
    companyExits: {
        type: String
    },
    metneighboreFirst: {
        type: String
    },
    metneighboreSecond: {
        type: String
    },
    confrimationAboutCompany: {
        type: String
    },
    currentCompanyExitThere: {
        type: String
    },
    totalFloor: {
        type: String
    },
    permissiveExitWhichFloor: {
        type: String
    },
    landArea: {
        type: String
    },
    localityOfAddress: {
        type: String
    },
    entryAllow: {
        type: String
    },
    permissiveExitOnwhichFloor: {
        type: String
    },
    nameBoardSeen: {
        type: String
    },
    meetPersonnameAndDesignationFirst: {
        type: String
    },
    meetPersonnameAndDesignationSecond: {
        type: String
    },
    anyConfirmation: {
        type: String
    },
    firstColleagueName: {
        type: String
    },
    secondColleagueName: {
        type: String
    },
    detailsSharedByColleague: {
        type: String
    },
    totalEmployee: {
        type: Number
    },
    seenEmployee: {
        type: Number
    },
    natureOfBusiness: {
        type: String
    },
    setupAndActivity: {
        type: String
    },
    metPersonName: {
        type: String
    },
    designation: {
        type: String
    },
    appliciantDesignation: {
        type: String
    },
    tenureOfBusiness: {
        type: String
    },
    idCardShown: {
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
    // ,
    // pdfPath:{
    //     type:String
    // }
})

const OfficeModel = mongoose.model("Office", officeSchema)

module.exports = OfficeModel