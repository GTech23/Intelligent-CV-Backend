import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function register(req, res) {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hash });

    await newUser.save();

    res.status(201).json({ message: `User created successfully` });
  } catch (err) {
    console.error(err.message);
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
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({ message: `Login successful`, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: `Something went wrong - ${error.message}` });
  }
}
