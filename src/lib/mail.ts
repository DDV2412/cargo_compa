import nodemailer from "nodemailer";

export const sendMailServer = async (
  options: {
    email: string;
    subject: string;
    text: string;
    htmlContent: string;
  },
  retry = 3,
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === "true",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Cargo Compa" <${process.env.MAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.text,
      html: options.htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    return info;
  } catch (error) {
    if (retry > 0) {
      console.log(`Retrying... Attempts left: ${retry}`);
      await sendMailServer(options, retry - 1);
    } else {
      throw error;
    }
  }
};
