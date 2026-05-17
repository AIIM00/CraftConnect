import prisma from "../src/prisma.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import transporter from "../config/nodemailer.js";

//ADD ADMIN
export const addAdmin = async (req, res) => {
  const { email } = req.body;
  const adminId = req.user.id; //currentlyl logged-in admin
  const existing = await prisma.user.findUnique({
    where: { email },
  });
  const existingInvite = await prisma.adminInvite.findUnique({
    where: { email },
  });

  if (!existing) {
    if (
      existingInvite &&
      !existingInvite.used &&
      existingInvite.expiresAt > new Date()
    ) {
      return res
        .status(400)
        .json({ message: "An active invite already exists for this email" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); //24 hours
    //Save invite to DB
    await prisma.adminInvite.create({
      data: {
        email,
        token,
        expiresAt,
        createdBy: adminId,
      },
    });
    //Send email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Admin invitation to CraftConnect Dashboard",
      text: `Hi,

You have been invited to become an admin on CraftConnect.

Click the link below to set your password and login:

${process.env.FRONTEND_URL}/admin/invite?token=${token}

This link will expire in 24 hours.

Best,
The CraftConnect Team
`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: "Invitation sent successfully" });
  } else {
    return res.status(400).json({ message: "Admin already exists" });
  }
};

//ACCEPT ADMIN REQUEST
export const acceptAdminInvite = async (req, res) => {
  try {
    const { name, phoneNumber, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    //  Find invite
    const invite = req.invite; //FROM MIDDLEWARE

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { email: invite.email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create the admin user using invite email
    const admin = await prisma.user.create({
      data: {
        name: name,
        email: invite.email,
        password: hashedPassword,
        phoneNumber,
        role: "ADMIN",
        isAccountVerified: true,
      },
    });

    // Mark invite as used
    await prisma.adminInvite.update({
      where: { token: invite.token },
      data: { used: true },
    });
    res.json({ message: "Admin account created successfully", admin });
  } catch (error) {
    console.error("Error accepting admin invite:", error);
    res.status(500).json({ message: "Internal2 server error" });
  }
};
