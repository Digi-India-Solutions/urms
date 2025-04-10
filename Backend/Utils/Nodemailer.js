const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Corrected the host
    port: 587, // Port for TLS
    secure: false, // Use TLS (SSL is port 465, but we use 587 for STARTTLS)
    auth: {
        user: "mannu22072000@gmail.com", // Your email
        pass: "swsz jmdo vpec okka", // Use an App Password if 2FA is enabled
    },
    tls: {
        rejectUnauthorized: false, // Allows self-signed certificates
    },
});

module.exports = { transporter };
