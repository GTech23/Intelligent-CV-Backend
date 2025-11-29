import connectDB from "../src/config/db.js";
import { sendEmail } from "../src/services/email.js";
import User from "../src/models/User.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectDB();

  const { email } = req.body;

  const generateOTP = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found`,
      });
    }

    user.otp = generateOTP;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset Request for Intelligent CV",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                <h2 style="color: #EA723C;">Password Reset for Intelligent CV</h2>
                <p>You have requested a password reset for your Intelligent CV account.</p>
                <p>Please use the following One-Time Password (OTP) to reset your password:</p>
                <p style="font-size: 24px; font-weight: bold; color: #EA723C; text-align: center; margin: 30px 0;">${generateOTP}</p>
                <p>This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Best regards,<br>The <span style="color: #EA723C;">IntelligentCV</span> Team</p>
            </div>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email.",
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send password reset email.",
    });
  }
}
