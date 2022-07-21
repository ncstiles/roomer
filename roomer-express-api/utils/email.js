require("dotenv").config();
const nodemailer = require("nodemailer");

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

async function sendEmail(sendTo, subject, body) {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: "roomerteam@outlook.com",
      pass: "R00mer!!",
    },
  });

  const mailOptions = {
    from: "roomerteam@outlook.com",
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
};
