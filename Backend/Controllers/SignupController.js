const SignupModel = require("../Models/SignupModel")
const passwordValidator = require("password-validator")
const bcrypt = require('bcrypt');
const saltRounds = 12;
const jwt = require('jsonwebtoken');
const { transporter } = require("../Utils/Nodemailer");
// const { transporter } = require("../Utils/Nodemailer");

var schema = new passwordValidator();

// Add properties to it
schema
    .is().min(6)
    .is().max(10)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().digits(1)
    .has().not().spaces()
const createAccount = async (req, res) => {
    try {
        console.log(req.body)
        const { fullName, email, address, password } = req.body
        const errorMessage = []
        if (!fullName) errorMessage.push("FullName is required");
        if (!email) errorMessage.push("Email is required");
        if (!address) errorMessage.push("Address is required");
        if (!password) errorMessage.push("Password is required");
        if (errorMessage.length > 0) {
            return res.status(400).json({
                success: false,
                message: errorMessage.join(",")
            })
        }

        const existingUser = await SignupModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered",
            });
        }

        if (!schema.validate(password)) {
            return res.status(400).json({
                success: false,
                message: "Password validation failed: Password must be at least 6 characters long, Password must have at least 1 uppercase letter"
            })
        }
        const hashPassword = await bcrypt.hash(password, saltRounds)
        const data = new SignupModel({ fullName, email, address, password: hashPassword })
        await data.save()
        return res.status(200).json({
            success: true,
            message: "Signup Completed Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getRecord = async (req, res) => {
    try {
        const data = await SignupModel.find()
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Record Not Found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Record Found Successfully",
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getSingleRecord = async (req, res) => {
    try {
        const data = await SignupModel.findById(req.params.id)
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Record Not Found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Record Found Successfully",
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const deleteRecord = async (req, res) => {
    try {
        const data = await SignupModel.findByIdAndDelete(req.params.id)
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Record Not Found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Record Delete Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is must required"
            })
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Email is must required"
            })
        }

        const exitUser = await SignupModel.findOne({ email: email })
        if (!exitUser) {
            return res.status(400).json({
                success: false,
                message: "User Not Exits"
            })
        }
        const checkPassword = await bcrypt.compare(password, exitUser.password)
        if (!checkPassword) {
            return res.status(400).json({
                success: false,
                message: "Invaild Password"
            })
        }

        const payload = { id: exitUser._id, email: exitUser.email, role: exitUser.role };
        const secretKey = exitUser.role === 'Admin' ? process.env.JWT_KEY_FOR_ADMIN : process.env.JWT_KEY_FOR_USER;
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        return res.status(200).json({
            success: true,
            message: "Login Successfully",
            data: exitUser,
            token: token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is must required"
            })
        }
        const userDetails = await SignupModel.findOne({ email: email })
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
        const userDetails = await SignupModel.findOne({ email: email });
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
        const userDetails = await SignupModel.findOne({ email: email });
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
    createAccount, getRecord, getSingleRecord, deleteRecord, login, sendOtp, verifyOtp, resetPassword
}