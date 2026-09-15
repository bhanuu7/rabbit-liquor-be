const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

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

const sendOrderConfirmationEmail = async (
  email,
  items,
  total_price,
  orderId,
) => {
  // Dynamically map items into HTML table rows
  const jsonData = {
    orderId,
    items,
  };
  const qrString = JSON.stringify(jsonData);
  const qrCodeBuffer = await QRCode.toBuffer(qrString);
  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${Number(item.price).toFixed(2)}</td>
        </tr>
      `,
    )
    .join("");

  const mailOptions = {
    from: `"Rabbit Liquor" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order Confirmation #${orderId} - Rabbit Liquor`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>We've received your order and preparing it for shipment.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: left;">Item</th>
            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: center;">Qty</th>
            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <h3 style="text-align: right; margin-top: 20px;">Total: $${Number(total_price).toFixed(2)}</h3>
    `,
    attachments: [
      {
        filename: `${orderId}-qrcode.png`,
        content: qrCodeBuffer,
        cid: "orderQRCode", // References <img src="cid:orderQRCode"> in HTML
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendRestockEmail, sendOrderConfirmationEmail };
