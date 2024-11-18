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
      host: "mail.barkahlabs.com",
      port: 465,
      secure: true,
      auth: {
        user: "noval@barkahlabs.com",
        pass: "9w$wtT9yIn8-",
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
