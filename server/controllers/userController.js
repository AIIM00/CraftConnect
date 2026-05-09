import prisma from "../src/prisma.js";
import { assignNextCraftsman } from "../services/taskAssignmentService.js";

//Get All services categories
export const browseServices = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        services: {
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Book a service

export const bookTask = async (req, res) => {
  try {
    const {
      categoryName,
      serviceName,
      description,
      location,
      latitude,
      longitude,
    } = req.body;
    const userId = req.user.id;

    if (
      !categoryName ||
      !serviceName ||
      !description ||
      !location ||
      !latitude ||
      !longitude
    ) {
      return res.status(400).json({
        success: false,
        message: "Category, service, description, and location are required",
      });
    }

    const category = await prisma.category.findUnique({
      where: { name: categoryName },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `${categoryName} category not found`,
      });
    }

    const service = await prisma.service.findUnique({
      where: {
        name_categoryId: {
          name: serviceName,
          categoryId: category.id,
        },
      },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `${serviceName} service not found in ${categoryName}`,
      });
    }

    const latitudeNumber = Number(latitude);
    const longitudeNumber = Number(longitude);
    if (Number.isNaN(latitudeNumber) || Number.isNaN(longitudeNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid location coordinates",
      });
    }

    const booking = await prisma.task.create({
      data: {
        userId,
        categoryId: category.id,
        serviceId: service.id,
        title: `Service request for ${category.name}`,
        description,
        location: location || `${latitude}, ${longitude}`,
        latitude: Number(latitude),
        longitude: Number(longitude),
        status: "PENDING",
      },
      include: {
        category: true,
        service: true,
      },
    });

    try {
      await assignNextCraftsman(booking.id);
    } catch (assignError) {
      console.error("Auto-assignment failed:", assignError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Service booked successfully",
      booking,
    });
  } catch (error) {
    console.error("Error booking service:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await prisma.task.findMany({
      where: { userId },
      include: {
        category: true,
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
    });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.user.id;
    const booking = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (!["PENDING", "WAITING"].includes(booking.status)) {
      return res.status(403).json({
        message: "Task already assigned, you cannot cancel it anymore.",
      });
    }
    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "CANCELLED",
      },
    });
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Track booking status
export const trackTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.user.id;
    const booking = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        category: true,
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
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.json({
      status: booking.status,
      assignedCraftsman: booking.craftsman,
    });
  } catch (error) {
    console.error("Error tracking booking status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//leave feedback for a completed service
export const leaveReview = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const ratingNumber = Number(rating);
    if (!ratingNumber || ratingNumber < 1 || ratingNumber > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }
    if (comment && comment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Comment must be less than 1000 characters",
      });
    }
    const booking = await prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (booking.status !== "COMPLETED") {
      return res
        .status(400)
        .json({ message: "Cannot leave review for incomplete service" });
    }
    if (!booking.craftsmanId) {
      return res
        .status(400)
        .json({ message: "No craftsman assigned to this task" });
    }
    const review = await prisma.review.create({
      data: {
        taskId,
        userId,
        craftsmanId: booking.craftsmanId,
        rating,
        comment,
        createdAt: new Date(),
      },
    });
    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "You already reviewed this task",
      });
    }

    console.error("Error submitting review:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//GET USER DATA
export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;
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
    res.json({
      success: true,
      userData: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
