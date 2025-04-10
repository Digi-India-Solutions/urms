const express = require("express");
const upload = require("../Middleware/Multer");
const { createRemark, getAllRemarks, getRemarkById, updateRemark, deleteRemark } = require("../Controllers/RemarkController");
const RemarkRouter = express.Router();


RemarkRouter.post("/upload-remark", upload.fields([{ name: 'addressImage', maxCount: 5 }, { name: 'images', maxCount: 5 }]), createRemark);
RemarkRouter.get("/get-remark", getAllRemarks);
RemarkRouter.get("/get-single-remark/:id", getRemarkById);
RemarkRouter.put("/update-remark/:id", upload.fields([{ name: 'addressImage', maxCount: 5 }, { name: 'images', maxCount: 5 }]), updateRemark);
RemarkRouter.delete("/delete-remark/:id", deleteRemark);

module.exports = RemarkRouter;
