import { TaskStatus } from "@prisma/client";
import prisma from "../src/prisma.js";
import { all } from "axios";

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
      where: { role: "CUSTOMER", isDeleted: false },
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

// GET CUSTOMER INSIGHTS FOR ADMIN DASHBOARD
export const getCustomerInsights = async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        isAccountVerified: true,
        createdAt: true,

        location: {
          select: {
            city: true,
            address: true,
            apartment: true,
            latitude: true,
            longitude: true,
          },
        },

        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            status: true,
            createdAt: true,
            scheduledDate: true,
            completedAt: true,

            category: {
              select: {
                name: true,
              },
            },

            service: {
              select: {
                name: true,
              },
            },

            craftsman: {
              select: {
                userId: true,
                user: {
                  select: {
                    name: true,
                    email: true,
                    phoneNumber: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const allCustomers = customers.map((customer) => {
      const totalTasks = customer.tasks.length;
      const inProgressTasks = customer.tasks.filter(
        (task) => task.status === "IN_PROGRESS",
      );
      const completedTasks = customer.tasks.filter(
        (task) => task.status === "COMPLETED",
      );
      const pendingTasks = customer.tasks.filter((task) =>
        ["PENDING", "WAITING", "UNASSIGNABLE"].includes(task.status),
      );

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        isAccountVerified: customer.isAccountVerified,
        createdAt: customer.createdAt,
        location: customer.location,

        totalTasks,
        inProgressTasksCount: inProgressTasks.length,
        completedTasksCount: completedTasks.length,
        pendingTasksCount: pendingTasks.length,

        latestTask: customer.tasks[0] || null,
      };
    });

    const topCustomers = [...allCustomers]
      .sort((a, b) => b.totalTasks - a.totalTasks)
      .slice(0, 10);

    const cityMap = new Map();

    for (const customer of allCustomers) {
      const city = customer.location?.city || "Unknown city";

      if (!cityMap.has(city)) {
        cityMap.set(city, {
          city,
          customersCount: 0,
          customers: [],
        });
      }

      const cityEntry = cityMap.get(city);
      cityEntry.customersCount += 1;
      cityEntry.customers.push({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
      });
    }

    const customersByCity = Array.from(cityMap.values()).sort(
      (a, b) => b.customersCount - a.customersCount,
    );

    const customersWithInProgressTasks = customers.flatMap((customer) => {
      const inProgressTasks = customer.tasks.filter(
        (task) => task.status === "IN_PROGRESS",
      );

      return inProgressTasks.map((task) => ({
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          location: customer.location,
        },
        task,
      }));
    });

    return res.json({
      success: true,
      allCustomers,
      topCustomers,
      customersByCity,
      customersWithInProgressTasks,
    });
  } catch (error) {
    console.error("Error fetching customer insights:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
//GET USER DATA BY ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id: userId, isDeleted: false },
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
    const user = await prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
