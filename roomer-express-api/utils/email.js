require("dotenv").config();
const nodemailer = require("nodemailer");

// There are two types of emails: emails containing a link to reset password (requestSubject/ requestBody)
// and emails confirming password reset (confirmationSubject/confirmationBody)
const requestSubject = "Your password reset request";
const requestBody = (firstName, resetLink) => {
  return `
    <p> Hello ${firstName}! </p>
    <p>You recently requested for your password to be reset.  Please click
        <a href=${resetLink}>this link</a>
        to reset your password.</p>
    <p>Thanks!</p>
    <p>The Roomer Team</p>
    `;
};

const confirmationSubject = "Password has been reset!";
const confirmationBody = (firstName) => {
  return `
        <p> Hello ${firstName}! </p>
        <p>This is a notification that your password has been successfully reset.</p>
        <p>Thanks!</p>
        <p>The Roomer Team</p>
        `;
};

async function sendEmail(sendTo, subject, body) {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PW,
    },
  });

  const mailOptions = {
    from: "Roomer Team <roomerteam@outlook.com>",
    to: sendTo,
    subject: subject,
    html: body,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return error;
    } else {
      return res.status(200).send({ success: true });
    }
  });
}

module.exports = {
  sendEmail,
  requestSubject,
  requestBody,
  confirmationSubject,
  confirmationBody,
};
