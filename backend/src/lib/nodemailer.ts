import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "digitaltenanttestingapp@gmail.com",
    pass: "hhpv cekj rzqj rone",
  },
});

export default transporter;
