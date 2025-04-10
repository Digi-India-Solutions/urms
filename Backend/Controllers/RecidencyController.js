const ResidencyModel = require("../Models/ResidenceProfileModel");
const TaskModel = require("../Models/TaskModel");
const { uploadImage, deleteImage } = require("../Utils/cloudinaryConfig");
const fs = require("fs");

// Create a new residency record
const createResidency = async (req, res) => {
    try {
        // Ensure taskID is provided
        if (!req.body.taskID) {
            return res.status(400).json({ message: "taskID is required" });
        }

        // Handling addressImage uploads
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

        // Handling images uploads
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

        // Create residency record with both addressImage and images
        const residencyData = new ResidencyModel({
            ...req.body,
            addressImage: uploadedAddressImages, // Store addressImage URLs
            images: uploadedImages // Store other image URLs
        });

        const savedResidency = await residencyData.save();

        // Update the task status to "Completed"
        await TaskModel.findByIdAndUpdate(req.body.taskID, { status: "Draft" });

        res.status(200).json({
            success: true,
            message: "Residency record created successfully",
            data: savedResidency
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

// Get all residency records
const getAllResidencies = async (req, res) => {
    try {
        const residencies = await ResidencyModel.find();
        if (!residencies) {
            return res.status(404).json({
                success: false,
                message: "No Residency records found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Residency records retrieved successfully",
            data: residencies
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single residency record by ID
const getResidencyById = async (req, res) => {
    try {
        const residency = await ResidencyModel.findById(req.params.id);
        if (!residency) {
            return res.status(404).json({ message: 'Residency not found' });
        }
        res.status(200).json({
            success: true,
            message: "Residency record retrieved successfully",
            data: residency
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a residency record by ID
const updateResidency = async (req, res) => {
    try {
        const residency = await ResidencyModel.findById(req.params.id);
        if (!residency) {
            return res.status(404).json({ message: 'Residency not found' });
        }

        // Delete old images from Cloudinary if they exist
        if (residency.addressImage && residency.addressImage.length > 0) {
            for (const image of residency.addressImage) {
                const publicId = image.split("/").pop().split(".")[0]; // Extract the public ID
                await deleteImage(publicId);
            }
        }

        if (residency.images && residency.images.length > 0) {
            for (const image of residency.images) {
                const publicId = image.split("/").pop().split(".")[0]; // Extract the public ID
                await deleteImage(publicId);
            }
        }

        // Handling new addressImage uploads
        const addressImageUploads = req.files.addressImage
            ? req.files.addressImage.map(async (file) => {
                const imageUrl = await uploadImage(file.path);
                fs.unlink(file.path, (err) => {
                    if (err) {
                        console.error("Error deleting addressImage file:", err);
                    }
                });
                return imageUrl;
            })
            : [];
        const uploadedAddressImages = await Promise.all(addressImageUploads);

        // Handling new images uploads
        const imageUploads = req.files.images
            ? req.files.images.map(async (file) => {
                const imageUrl = await uploadImage(file.path);
                fs.unlink(file.path, (err) => {
                    if (err) {
                        console.error("Error deleting images file:", err);
                    }
                });
                return imageUrl;
            })
            : [];
        const uploadedImages = await Promise.all(imageUploads);

        // Update residency record with both new addressImage and images
        const updatedResidency = await ResidencyModel.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                addressImage: uploadedAddressImages.length > 0 ? uploadedAddressImages : residency.addressImage,
                images: uploadedImages.length > 0 ? uploadedImages : residency.images,
            },
            { new: true }
        );

        res.status(200).json(updatedResidency);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a residency record by ID
const deleteResidency = async (req, res) => {
    try {
        const residency = await ResidencyModel.findById(req.params.id);
        if (!residency) {
            return res.status(404).json({ message: 'Residency not found' });
        }

        // Delete images from Cloudinary
        if (residency.addressImage && residency.addressImage.length > 0) {
            for (const image of residency.addressImage) {
                const publicId = image.split("/").pop().split(".")[0]; // Extract the public ID
                await deleteImage(publicId);
            }
        }

        if (residency.images && residency.images.length > 0) {
            for (const image of residency.images) {
                const publicId = image.split("/").pop().split(".")[0]; // Extract the public ID
                await deleteImage(publicId);
            }
        }

        // Delete the residency record
        await ResidencyModel.findByIdAndDelete(req.params.id);
        res.status(204).json(); // No content to send back
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export the controller functions
module.exports = {
    createResidency,
    getAllResidencies,
    getResidencyById,
    updateResidency,
    deleteResidency
};
