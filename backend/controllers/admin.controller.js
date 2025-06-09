import { Admin } from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const adminSchema = z.object({
    firstName: z.string().min(3, { message: "First name should be at least 3 characters long" }),
    lastName: z.string().min(3, { message: "Last name should be at least 3 characters long" }),
    email: z.string().email(),
    password: z.string().min(4, { message: "Password must be at least 4 characters long" }),
  });

  const validateData = adminSchema.safeParse(req.body);
  if (!validateData.success) {
    return res.status(400).json({ errors: validateData.error.issues.map(err => err.message) });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ errors: "Admin already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ firstName, lastName, email, password: hashPassword });
    await newAdmin.save();

    return res.status(201).json({ message: "Signup successful", newAdmin });
  } catch (error) {
    console.log("Error in signup:", error);
    return res.status(500).json({ errors: "Error in signup" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_ADMIN_PASSWORD, { expiresIn: "1d" });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      expires: new Date(Date.now() + 86400000), // 1 day
    });

    return res.status(200).json({ message: "Login successful", admin, token });
  } catch (error) {
    console.log("Error in login:", error);
    return res.status(500).json({ errors: "Error in login" });
  }
};

export const logout = async (req, res) => {
  try {
   
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout:", error);
    return res.status(500).json({ errors: "Error in logout" });
  }
};
