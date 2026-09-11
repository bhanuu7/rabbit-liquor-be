const sendRestockEmail = require("./emailService.js");
const pool = require("../db.js");

const processRestockNotifications = async (id, item_name, price) => {
  try {
    console.log("🔔 Processing restock notifications for:", id);

    // 2. Fetch pending notify requests
    const notifyRes = await pool.query(
      `SELECT * FROM notify_requests 
       WHERE product_id = $1 AND status = 'pending'`,
      [id],
    );

    const requests = notifyRes.rows;

    if (requests.length === 0) {
      console.log("No pending notifications");
      return;
    }

    console.log(requests);
    // 3. Loop and send emails
    for (const req of requests) {
      try {
        if (req.email) {
          await sendRestockEmail({
            email: req.email,
            item_name,
            price,
          });
        }
        // TODO: add WhatsApp later
        // 4. Mark as notified
        await pool.query(
          `UPDATE notify_requests 
           SET status = 'notified', notified_at = NOW()
           WHERE id = $1`,
          [req.id],
        );
      } catch (err) {
        console.error("Failed for user:", req.id, err);
        // keep status as pending → retry later
      }
    }

    console.log("✅ Notifications processed");
  } catch (error) {
    console.error("Notify service error:", error);
  }
};
module.exports = { processRestockNotifications };
