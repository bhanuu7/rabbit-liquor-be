const nodemailer = require("nodemailer");

// create transporter (use your SMTP creds)
const transporter = nodemailer.createTransport({
  service: "gmail", // or use SMTP config
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // use app password (not your real password)
  },
});

const sendRestockEmail = async ({ email, item_name, price }) => {
  const mailOptions = {
    from: `"Rabbit Liquor" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🔥 ${item_name} is back in stock!`,
    html: `
      <h2>Good news!</h2>
      <p><b>${item_name}</b> is now available.</p>
      <p>Price: $${price}</p>
      <a href="${process.env.FRONTEND_URL}">
        <button style="padding:10px 20px; background:black; color:white;">
          Buy Now
        </button>
      </a>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendRestockEmail;
