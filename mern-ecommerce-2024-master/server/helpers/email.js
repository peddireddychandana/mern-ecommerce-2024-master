const nodemailer = require("nodemailer");
const https = require("https");
const User = require("../models/User");

function getTransporter() {
  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s/g, "") : "";

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass,
    },
  });
}

function sendViaBrevoApi({ to, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return Promise.reject(new Error("BREVO_API_KEY not set"));

  const data = JSON.stringify({
    sender: { name: process.env.BUSINESS_NAME, email: process.env.SMTP_USER },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "api.brevo.com",
        path: "/v3/smtp/email",
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log("Email sent via Brevo API");
            resolve();
          } else {
            reject(new Error(`Brevo API ${res.statusCode}: ${body}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function sendEmail({ to, subject, html }) {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"${process.env.BUSINESS_NAME}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent via SMTP");
    return;
  } catch (smtpErr) {
    console.log("SMTP failed, trying Brevo API fallback:", smtpErr.message);
  }

  try {
    await sendViaBrevoApi({ to, subject, html });
  } catch (brevoErr) {
    console.error("Both SMTP and Brevo API failed:", brevoErr.message);
  }
}

async function notifyNewOrder(order) {
  try {
    const user = await User.findById(order.userId);
    const customerName = user?.userName || "Unknown";
    const customerEmail = user?.email || "Unknown";

    const itemsRows = order.cartItems
      .map(
        (i) =>
          `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${i.title}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">$${i.price}</td></tr>`
      )
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#6B1E2E;padding:20px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;">New Order Received</h1>
        </div>
        <div style="padding:20px;background:#f9f9f9;">
          <p style="font-size:16px;color:#333;">Order <strong>#${order._id}</strong></p>

          <h3 style="color:#6B1E2E;margin-top:20px;">Customer Details</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:4px;color:#666;">Name</td><td style="padding:4px;font-weight:bold;">${customerName}</td></tr>
            <tr><td style="padding:4px;color:#666;">Email</td><td style="padding:4px;font-weight:bold;">${customerEmail}</td></tr>
            <tr><td style="padding:4px;color:#666;">Phone</td><td style="padding:4px;font-weight:bold;">${order.addressInfo?.phone || "N/A"}</td></tr>
            <tr><td style="padding:4px;color:#666;">Address</td><td style="padding:4px;font-weight:bold;">${order.addressInfo?.address || "N/A"}, ${order.addressInfo?.city || "N/A"} - ${order.addressInfo?.pincode || "N/A"}</td></tr>
          </table>

          <h3 style="color:#6B1E2E;margin-top:20px;">Order Items</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead><tr style="background:#6B1E2E;color:#fff;"><th style="padding:8px;text-align:left;">Product</th><th style="padding:8px;">Qty</th><th style="padding:8px;text-align:right;">Price</th></tr></thead>
            <tbody>${itemsRows}</tbody>
          </table>

          <div style="margin-top:20px;padding:15px;background:#fff;border-radius:5px;">
            <table style="width:100%;">
              <tr><td style="padding:4px;color:#666;">Total Amount</td><td style="padding:4px;font-weight:bold;font-size:18px;text-align:right;">$${order.totalAmount}</td></tr>
              <tr><td style="padding:4px;color:#666;">Payment Method</td><td style="padding:4px;font-weight:bold;text-align:right;text-transform:capitalize;">${order.paymentMethod}</td></tr>
              <tr><td style="padding:4px;color:#666;">Payment Status</td><td style="padding:4px;font-weight:bold;text-align:right;text-transform:capitalize;">${order.paymentStatus}</td></tr>
              <tr><td style="padding:4px;color:#666;">Order Status</td><td style="padding:4px;font-weight:bold;text-align:right;text-transform:capitalize;">${order.orderStatus}</td></tr>
            </table>
          </div>

          <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/admin/orders" style="display:block;margin-top:20px;padding:12px;background:#6B1E2E;color:#fff;text-align:center;text-decoration:none;border-radius:5px;font-size:16px;">View in Admin Panel</a>
        </div>
      </div>`;

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Order #${order._id} - $${order.totalAmount}`,
      html,
    });
  } catch (err) {
    console.error("Email error:", err.message);
  }
}

async function notifyPaymentVerification(order) {
  try {
    const user = await User.findById(order.userId);

    const itemsRows = order.cartItems
      .map(
        (i) =>
          `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${i.title}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">$${i.price}</td></tr>`
      )
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#e67e22;padding:20px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;">Payment Verification Needed</h1>
        </div>
        <div style="padding:20px;background:#f9f9f9;">
          <p style="font-size:16px;color:#333;">Order <strong>#${order._id}</strong></p>

          <h3 style="color:#e67e22;margin-top:20px;">Customer</h3>
          <p style="font-weight:bold;">${user?.userName || "Unknown"}</p>

          <h3 style="color:#e67e22;margin-top:20px;">Items</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead><tr style="background:#e67e22;color:#fff;"><th style="padding:8px;text-align:left;">Product</th><th style="padding:8px;">Qty</th><th style="padding:8px;text-align:right;">Price</th></tr></thead>
            <tbody>${itemsRows}</tbody>
          </table>

          <div style="margin-top:20px;padding:15px;background:#fff;border-radius:5px;">
            <table style="width:100%;">
              <tr><td style="padding:4px;color:#666;">Amount</td><td style="padding:4px;font-weight:bold;font-size:18px;text-align:right;">$${order.totalAmount}</td></tr>
              <tr><td style="padding:4px;color:#666;">Method</td><td style="padding:4px;font-weight:bold;text-align:right;text-transform:capitalize;">${order.paymentMethod}</td></tr>
              <tr><td style="padding:4px;color:#666;">Ref ID</td><td style="padding:4px;font-weight:bold;text-align:right;">${order.paymentId}</td></tr>
            </table>
          </div>

          <p style="margin-top:20px;padding:12px;background:#fff3cd;border-radius:5px;color:#856404;">Check your UPI app to verify payment, then confirm the order in the admin panel.</p>

          <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/admin/orders" style="display:block;margin-top:10px;padding:12px;background:#e67e22;color:#fff;text-align:center;text-decoration:none;border-radius:5px;font-size:16px;">Go to Admin Panel</a>
        </div>
      </div>`;

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `Payment Verification - Order #${order._id}`,
      html,
    });
  } catch (err) {
    console.error("Email error:", err.message);
  }
}

module.exports = { notifyNewOrder, notifyPaymentVerification };
