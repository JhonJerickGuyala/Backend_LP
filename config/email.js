import nodemailer from 'nodemailer';
import 'dotenv/config.js'; 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Email Server Error:", error);
  } else {
    console.log("✅ Email Server is ready to take our messages");
  }
});

export default transporter;