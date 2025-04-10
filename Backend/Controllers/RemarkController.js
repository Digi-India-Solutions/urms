const RemarkModel = require("../Models/RemarkModel");
const fs = require("fs");
const { uploadImage, deleteImage } = require("../Utils/cloudinaryConfig");
const OfficeModel = require("../Models/ProfileModel");
const ResidencyModel = require("../Models/ResidenceProfileModel");

// Create a new remark
const createRemark = async (req, res) => {
    try {
        // Handle addressImage uploads
        const addressImageUploads = req.files.addressImage
            ? req.files.addressImage.map(async (file) => {
                const imageUrl = await uploadImage(file.path);
                // Delete file from local storage after uploading to Cloudinary
                fs.unlink(file.path, (err) => {
                    if (err) {
                        console.error("Error deleting addressImage file:", err);
                    }
                });
                return imageUrl;
            })
            : [];

        const uploadedAddressImages = await Promise.all(addressImageUploads);

        // Handle other images uploads
        const imageUploads = req.files.images
            ? req.files.images.map(async (file) => {
                const imageUrl = await uploadImage(file.path);
                // Delete file from local storage after uploading to Cloudinary
                fs.unlink(file.path, (err) => {
                    if (err) {
                        console.error("Error deleting images file:", err);
                    }
                });
                return imageUrl;
            })
            : [];

        const uploadedImages = await Promise.all(imageUploads);

        // Create a new remark record with both addressImage and images
        const remarkData = new RemarkModel({
            ...req.body,
            addressImage: uploadedAddressImages, // Store addressImage URLs
            images: uploadedImages // Store other image URLs
        });

        const savedRemark = await remarkData.save();
        res.status(200).json({
            success: true,
            message: "Remark created successfully",
            data: savedRemark
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllRemarks = async (req, res) => {
    try {
        // Fetch data from Office and Residency models
        const offices = await OfficeModel.find().populate({
            path: 'taskID',
            model: 'Task'
        });
        
        const residencies = await ResidencyModel.find().populate({
            path: 'taskID',
            model: 'Task'
        });

        // Merge both arrays into a single array
        const combinedData = [...offices, ...residencies];

        if (combinedData.length === 0) {
            return res.status(404).json({ success: false, message: "No records found" });
        }

        res.status(200).json({
            success: true,
            data: combinedData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get a single remark by ID with dynamic population
const getRemarkById = async (req, res) => {
    try {
        const remark = await RemarkModel.findById(req.params.id).populate({
            path: 'officeformId resformId', // or 'resformId' based on your use case
            populate: {
                path: 'taskID', // Populate the taskID field
                model: 'Task' // Reference the Task model
            }
        });;
        if (!remark) {
            return res.status(404).json({ message: 'Remark not found' });
        }
        res.status(200).json({
            success: true,
            data: remark
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a remark by ID
const updateRemark = async (req, res) => {
    try {
        const remark = await RemarkModel.findById(req.params.id);
        if (!remark) {
            return res.status(404).json({ message: 'Remark not found' });
        }

        let uploadedAddressImages = remark.addressImage;
        let uploadedImages = remark.images;

        // Handle new addressImage uploads
        if (req.files && req.files.addressImage && req.files.addressImage.length > 0) {
            // Delete old addressImage from Cloudinary
            if (remark.addressImage && remark.addressImage.length > 0) {
                for (const image of remark.addressImage) {
                    const publicId = image.split("/").pop().split(".")[0];
                    await deleteImage(publicId);
                }
            }

            // Upload new addressImage
            const addressImageUploads = req.files.addressImage.map(async (file) => {
                const imageUrl = await uploadImage(file.path);
                fs.unlink(file.path, (err) => {
                    if (err) {
                        console.error("Error deleting addressImage file:", err);
                    }
                });
                return imageUrl;
            });
            uploadedAddressImages = await Promise.all(addressImageUploads);
        }

        // Handle new images uploads
        if (req.files && req.files.images && req.files.images.length > 0) {
            // Delete old images from Cloudinary
            if (remark.images && remark.images.length > 0) {
                for (const image of remark.images) {
                    const publicId = image.split("/").pop().split(".")[0];
                    await deleteImage(publicId);
                }
            }

            // Upload new images
            const imageUploads = req.files.images.map(async (file) => {
                const imageUrl = await uploadImage(file.path);
                fs.unlink(file.path, (err) => {
                    if (err) {
                        console.error("Error deleting images file:", err);
                    }
                });
                return imageUrl;
            });
            uploadedImages = await Promise.all(imageUploads);
        }

        // Update remark record with new data and images
        const updatedRemark = await RemarkModel.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                addressImage: uploadedAddressImages,
                images: uploadedImages
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Remark updated successfully',
            data: updatedRemark
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete a remark by ID
const deleteRemark = async (req, res) => {
    try {
        const remark = await RemarkModel.findById(req.params.id);
        if (!remark) {
            return res.status(404).json({ message: 'Remark not found' });
        }

        // Delete images from Cloudinary
        if (remark.addressImage && remark.addressImage.length > 0) {
            for (const image of remark.addressImage) {
                const publicId = image.split("/").pop().split(".")[0]; // Extract the public ID
                await deleteImage(publicId);
            }
        }

        if (remark.images && remark.images.length > 0) {
            for (const image of remark.images) {
                const publicId = image.split("/").pop().split(".")[0]; // Extract the public ID
                await deleteImage(publicId);
            }
        }

        // Delete the remark record
        await RemarkModel.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: "Remark deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export the controller functions
module.exports = {
    createRemark,
    getAllRemarks,
    getRemarkById,
    updateRemark,
    deleteRemark
};
