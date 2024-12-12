const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "modistadonaluz@gmail.com",
    pass: "stzf aahp samy rjgt",
  }
});



module.exports = transporter;
