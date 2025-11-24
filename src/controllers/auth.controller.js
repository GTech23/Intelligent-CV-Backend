import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import userSchema from "../validation/user-validator.js";

export async function register(req, res) {
  const { error, value } = userSchema.validate(req.body, { abortEarly: true });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map(d => d.message),
    });
  }

  const { username, email, password } = value;

  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hash });
    await newUser.save();
    res.status(201).json({ success: true, message: `User created successfully` });
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exist`
      })
    }
    res.status(500).json({ error: `Something went wrong - ${err.message}` });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const isPasswordMatch = bcrypt.compareSync(password, user?.password || "");
    if (!user || !isPasswordMatch)
      return res.status(400).json({ success: false, message: `Invalid credentials` });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({ success: true, message: `Login successful`, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: `Something went wrong - ${error.message}`,
    });
  }
}

export async function getAuthProfile(req, res) {
  const user = req.user;
  res.status(200).json({ data: user });
}

export async function requestPasswordReset(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: `You will receive an OTP to this email ${email} if the user exist` });
  }

  // generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();
  res.status(200).json({ success: true, message: `You will receive an OTP to this email ${email} if the user exist` });
}

export async function verifyOtp(req, res) {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: `User not found` });
  }
  if (user.otp !== otp || Date.now() > user.otpExpiry) {
    return res.status(400).json({ success: false, message: `Invalid or expired OTP` });
  }

  const matchedPassword = bcrypt.compare(newPassword, user.password);
  if (matchedPassword) {
    return res.status(400).json({ success: false, message: `New password must be different from the old password` });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  user.password = hash;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();
  res.status(200).json({ success: true, message: `Password reset successful` });
}