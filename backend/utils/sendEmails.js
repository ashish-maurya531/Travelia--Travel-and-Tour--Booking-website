import nodeMailer from "nodemailer";

const sendEmail = async (options) => {
    console.log("queue send", options)
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_APP_PASS,
        },
    });

    const mailOptions = {
        from: "mail@travelia.com",
        to: options.to,
        subject: options.subject,
        html: options.text,
    };

    console.log("mailoptions", mailOptions);
    await transporter.sendMail(mailOptions);
};

export default sendEmail;