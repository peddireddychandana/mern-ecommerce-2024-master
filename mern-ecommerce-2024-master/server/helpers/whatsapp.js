const https = require("https");
const User = require("../models/User");

const ADMIN_PHONES = [
  process.env.ADMIN_WHATSAPP,
].filter(Boolean);

function sendMessage(phone, message) {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!phone || !apiKey) return;

  const text = encodeURIComponent(message);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${text}&apikey=${apiKey}`;

  https
    .get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => console.log("WhatsApp sent to", phone, ":", data));
    })
    .on("error", (err) => console.error("WhatsApp error for", phone, ":", err.message));
}

function broadcast(message) {
  ADMIN_PHONES.forEach((phone) => sendMessage(phone, message));
}

async function notifyNewOrder(order) {
  try {
    const user = await User.findById(order.userId);
    const customerName = user?.userName || "Unknown";
    const customerEmail = user?.email || "Unknown";

    const items = order.cartItems
      .map((i, idx) => `${idx + 1}. ${i.title} x${i.quantity} - $${i.price}`)
      .join("\n");

    const msg = `🛒 NEW ORDER
Order: #${order._id}

👤 CUSTOMER
Name: ${customerName}
Email: ${customerEmail}
Phone: ${order.addressInfo?.phone || "N/A"}
Address: ${order.addressInfo?.address || "N/A"}, ${order.addressInfo?.city || "N/A"} - ${order.addressInfo?.pincode || "N/A"}

📦 ITEMS
${items}

💰 Total: $${order.totalAmount}
💳 Payment: ${order.paymentMethod}
📋 Status: ${order.orderStatus}`;

    broadcast(msg);
  } catch (err) {
    console.error("WhatsApp notifyNewOrder error:", err.message);
  }
}

async function notifyPaymentVerification(order) {
  try {
    const user = await User.findById(order.userId);
    const customerName = user?.userName || "Unknown";

    const items = order.cartItems
      .map((i, idx) => `${idx + 1}. ${i.title} x${i.quantity} - $${i.price}`)
      .join("\n");

    const msg = `⚠️ PAYMENT VERIFICATION NEEDED
Order: #${order._id}

👤 Customer: ${customerName}
💰 Amount: $${order.totalAmount}
💳 Method: ${order.paymentMethod}
🔖 Ref: ${order.paymentId}

📦 ITEMS
${items}

Check your UPI app and confirm in admin panel.`;

    broadcast(msg);
  } catch (err) {
    console.error("WhatsApp notifyPaymentVerification error:", err.message);
  }
}

module.exports = { notifyNewOrder, notifyPaymentVerification };