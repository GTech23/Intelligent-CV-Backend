import { sendEmail } from "../src/services/email.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { email, username } = req.body;

  try {
    await sendEmail({
      to: email,
      subject: "Welcome to Intelligent CV!",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
    <h2 style="color: #EA723C;">Welcome to Intelligent CV, ${username}!</h2>
    <p>Thank you for joining Intelligent CV. We're thrilled to have you as part of our community!</p>
    <p>Our platform is designed to help you create professional and impactful CVs with ease. Get started by exploring our templates and features.</p>
    <p style="margin-top: 20px;">
      <a href="https://intelligent-cv.vercel.app/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #EA723C; color: #ffffff; text-decoration: none; border-radius: 5px;">
        Get Started Now
      </a>
    </p>
    <p>If you have any questions, feel free to reach out to our support team.</p>
    <p>Best regards,<br>The <span style="color: #EA723C;">IntelligentCV</span> Team</p>
  </div>
</div>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Email failed" });
  }
}
