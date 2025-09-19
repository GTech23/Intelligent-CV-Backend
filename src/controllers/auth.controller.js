import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Joi from 'joi';
import userSchema from "../validation/user-validator.js";

export async function register(req, res) {
  const {error, value} = userSchema.validate(req.body, {abortEarly: false});

  if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        details: error.details.map(d => d.message),
      });
    }

    const {username, email, password} = value;

  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hash });

    await newUser.save();

    res.status(201).json({ message: `User created successfully` });
  } catch (err) {
    console.error(err.message);
    if(err.code === 11000){
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
      return res.status(400).json({ message: `Invalid credentials` });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
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
  res.status(200).json({ message: user });
}
