const bcrypt = require('bcrypt');
const FieldModel = require('../Models/FieldExcutiveModel');
const jwt = require('jsonwebtoken');


// Controller function for field signup
const signupField = async (req, res) => {
    const { name, email, phoneNumber, password, fieldExcutiveId } = req.body;

    // Check if all required fields are provided
    if (!name) {
        return res.status(400).json({ message: 'Please fill in the name' });
    }
    if (!email) {
        return res.status(400).json({ message: 'Please fill in the email' });
    }
    if (!phoneNumber) {
        return res.status(400).json({ message: 'Please fill in the phone number' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Please fill in the password' });
    }
    if (!fieldExcutiveId) {
        return res.status(400).json({ message: 'Please fill in the Field Excutive Id' });
    }

    try {
        // Check if email already exists
        const existingEmail = await FieldModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Check if phone number already exists
        const existingPhoneNumber = await FieldModel.findOne({ phoneNumber });
        if (existingPhoneNumber) {
            return res.status(400).json({ message: 'Phone number already exists' });
        }

        const existingfieldExcutiveId = await FieldModel.findOne({ fieldExcutiveId });
        if (existingfieldExcutiveId) {
            return res.status(400).json({ message: 'Field Excutive Id already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new field instance
        const newfield = new FieldModel({
            name,
            email,
            phoneNumber,
            fieldExcutiveId,
            password: hashedPassword,
        });
        await newfield.save();
        res.status(200).json({ message: 'field created successfully!' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function to get all fields
const getField = async (req, res) => {
    try {
        const fields = await FieldModel.find();
        if (!fields) {
            return res.status(404).json({
                success: false,
                message: "Record Not Found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Record Found",
            data: fields
        });
    } catch (error) {
        console.error('Error fetching fields:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function to delete a specific field by ID
const deleteField = async (req, res) => {
    const { id } = req.params;
    try {
        const field = await FieldModel.findByIdAndDelete(id);
        if (!field) {
            return res.status(404).json({ message: 'field not found' });
        }
        res.status(200).json({ message: 'field deleted successfully' });
    } catch (error) {
        console.error('Error deleting field:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const loginField = async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Please fill in the email' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Please fill in the password' });
    }
    try {
        const fieldExecutive = await FieldModel.findOne({ email });
        if (!fieldExecutive) {
            return res.status(404).json({ message: 'Field executive not found' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, fieldExecutive.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: fieldExecutive._id, email: fieldExecutive.email },
            process.env.JWT_KEY_FOR_FIELD,
            { expiresIn: '1h' }
        );
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            data: fieldExecutive
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is must required"
            })
        }
        const userDetails = await FieldModel.findOne({ email: email })
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        let otp = Math.floor(100000 + Math.random() * 900000);
        userDetails.otp = otp;
        await userDetails.save();
        const mailOptions = {
            from: "mannu22072000@gmail.com",
            to: userDetails.email, // list of receivers
            subject: "Password Reset Request", // Subject line
            text: `Your password reset code is ${otp}`, // plain text body
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #f44336; color: white; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Password Reset Request</h1>
                    </div>
                    <div style="padding: 20px; background-color: #f9f9f9;">
                        <h2 style="font-size: 20px; color: #333;">Reset Your Password</h2>
                        <p style="font-size: 16px; color: #555;">Hello,</p>
                        <p style="font-size: 16px; color: #555;">You recently requested to reset your password for your account. Use the OTP code below to complete the process:</p>
                        <p style="font-size: 24px; color: #f44336; text-align: center; font-weight: bold; margin: 20px 0;">${otp}</p>
                        <p style="font-size: 16px; color: #555;">If you did not request this, please ignore this email, and your password will remain unchanged.</p>
                        <p style="font-size: 14px; color: #777;">This OTP code is valid for the next 10 minutes. After that, you will need to request a new one.</p>
                    </div>
                    <div style="background-color: #f44336; color: white; text-align: center; padding: 10px;">
                        <p style="font-size: 14px; margin: 0;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                    </div>
                </div>
            `,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }
        const userDetails = await FieldModel.findOne({ email: email });
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (userDetails.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }
        res.status(200).json({
            success: true,
            message: "OTP verified successfully, you can reset your password",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while verifying OTP",
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email and new password are required",
            });
        }
        if (!schema.validate(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "Password validation failed: Password must be at least 6 characters long, Password must have at least 1 uppercase letter"
            })
        }
        const userDetails = await FieldModel.findOne({ email: email });
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        userDetails.password = hashedPassword;
        userDetails.otp = null;
        await userDetails.save();
        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while resetting password",
        });
    }
};
module.exports = {
    signupField, getField, deleteField, loginField, sendOtp, resetPassword, verifyOtp
};
