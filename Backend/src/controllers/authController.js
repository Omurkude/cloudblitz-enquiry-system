import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user (Public registration always gets the default non-admin 'staff' role)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "staff",
    });

    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password with hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
    );

    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const safeUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    };

    return res.status(200).json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};
