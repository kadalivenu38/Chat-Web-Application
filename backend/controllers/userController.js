import User from "../models/User.js";
import validator from "validator";
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken({userId: user._id, email: user.email});

    return res.status(201).json({ message: "User registered successfully.", token });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) {
          return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: "No user found on this email!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Password was Incorrect!" });
        }
        const token = generateToken({ userId: user._id, email: user.email });

        return res.status(200).json({ message: "Login successful.", token });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
}

const getUser = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({user});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
}
export { registerUser, loginUser, getUser };