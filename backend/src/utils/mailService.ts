import transporter from "@/config/nodemailer";

const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const mailOptions = {
      from: "digitaltenanttestingapp@gmail.com",
      to: to,
      subject: subject,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("email sent successfully: ", info.response);
  } catch (err) {
    console.log("email sending error: ", err);
  }
};

export { sendEmail };
