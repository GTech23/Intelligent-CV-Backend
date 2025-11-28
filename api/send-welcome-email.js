import { sendEmail } from "../src/services/email";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { email, username } = req.body;

  try {
    await sendEmail({
      to: email,
      subject: "Welcome to Intelligent CV!",
      html: `<h2>Hello ${username}, welcome!</h2>   <p>Thank you for signing up to our service. We are excited to have you on board!</p>    `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Email failed" });
  }
}
