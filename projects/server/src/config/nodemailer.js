const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ichsannuriman12@gmail.com",
    pass: "zsflnyniejbhwxzg",
  },
});

module.exports = transporter;
