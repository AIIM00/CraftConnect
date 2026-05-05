import prisma from "../src/prisma.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import transporter from "../config/nodemailer.js";

//ADMIN INFO
export const adminInfo = async (req, res) => {
  try {
    const adminId = req.user.id;
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });
    console.log("The admin info:", admin.name, admin.email, admin.phoneNumber);

    res.status(200).json({
      name: admin.name,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Get all customers data
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        isAccountVerified: true,
        role: true,
      },
    });
    res.json(customers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//GET USER DATA BY ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        isAccountVerified: true,
        role: true,
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE USER BY ID
export const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
