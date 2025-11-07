// sendWithEnsend.js
import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";  // or native fetch in Node 18+

async function sendEmailWithEnsend(to, subject, html) {
  const apiKey = process.env.ENSEND_API_KEY;  // you must set this
  const fromEmail = process.env.FROM_EMAIL;   // e.g., "Your App <noreply@yourdomain.com>"

  const url = "https://ensend.co/api/v1/send"; // VERIFY this endpoint in their docs

  const body = {
    from: fromEmail,
    to: [ to ],
    subject: subject,
    html: html
    // maybe textPart, cc, bcc etc depending on API
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Ensend error: ${data.message || res.statusText}`);
    }
    console.log("✅ Email sent via Ensend:", data);
  } catch (err) {
    console.error("❌ Error sending via Ensend:", err);
    throw err;
  }
}

// Example usage
if (require.main === module) {
  sendEmailWithEnsend("user@example.com", "Hello from Ensend", "<p>This is a test email</p>");
}
