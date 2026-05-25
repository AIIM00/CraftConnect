import prisma from "../src/prisma.js";
import { assignNextCraftsman } from "../services/taskAssignmentService.js";
import bcrypt from "bcryptjs";
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
    const customerId = req.user.id;

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
        customer: {
          connect: { id: customerId },
        },
        category: {
          connect: { id: category.id },
        },
        service: {
          connect: { id: service.id },
        },
        title: `Service request for ${category.name}`,
        description,
        location: location || `${latitude}, ${longitude}`,
        latitude: Number(latitude),
        longitude: Number(longitude),
        status: "PENDING",
        scheduledDate: null,
        completedAt: null,
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
      where: { customerId: userId },
      include: {
        category: true,
        service: true,
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
    });
    res.json({ success: true, bookings });
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
    if (booking.customerId !== userId) {
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
        service: true,
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
    if (booking.customerId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.json({
      status: booking.status,
      scheduledDate: booking.scheduledDate,
      completedAt: booking.completedAt,
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
    const {
      rating,
      qualityRating,
      punctualityRating,
      communicationRating,
      professionalismRating,
      cleanlinessRating,
      priceFairnessRating,
      wouldRecommend,
      wouldHireAgain,
      issueTags,
      comment,
    } = req.body;
    const ratings = {
      rating,
      qualityRating,
      punctualityRating,
      communicationRating,
      professionalismRating,
      cleanlinessRating,
      priceFairnessRating,
    };
    for (const [field, value] of Object.entries(ratings)) {
      const numberValue = Number(value);

      if (!numberValue || numberValue < 1 || numberValue > 5) {
        return res.status(400).json({
          success: false,
          message: `${field} must be between 1 and 5`,
        });
      }
    }
    if (comment && comment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Comment must be less than 1000 characters",
      });
    }
    if (issueTags && (!Array.isArray(issueTags) || issueTags.length > 5)) {
      return res.status(400).json({
        success: false,
        message: "issueTags must be an array with up to 5 items",
      });
    }

    const detailedAverage =
      (Number(qualityRating) +
        Number(punctualityRating) +
        Number(communicationRating) +
        Number(professionalismRating) +
        Number(cleanlinessRating) +
        Number(priceFairnessRating)) /
      6;

    const booking = await prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.customerId !== userId) {
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

        rating: Number(rating),
        qualityRating: Number(qualityRating),
        punctualityRating: Number(punctualityRating),
        communicationRating: Number(communicationRating),
        professionalismRating: Number(professionalismRating),
        cleanlinessRating: Number(cleanlinessRating),
        priceFairnessRating: Number(priceFairnessRating),
        detailedAverage,

        wouldRecommend: Boolean(wouldRecommend),
        wouldHireAgain: Boolean(wouldHireAgain),
        issueTags: issueTags || [],

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
        phoneNumber: true,
        role: true,
        isAccountVerified: true,
        location: {
          select: {
            city: true,
            address: true,
            apartment: true,
            longitude: true,
            latitude: true,
          },
        },
        craftsman: {
          select: {
            status: true,
            isAvailable: true,
            warningLevel: true,
          },
        },
        applications: {
          orderBy: {
            updatedAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            userId: true,
            categoryId: true,
            yearsOfExperience: true,
            city: true,
            address1: true,
            apartment: true,
            workingDays: true,
            workingHours: true,
            maxTravelDistance: true,
            scenarioQA: true,
            workBehaviorQA: true,
            step: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      userData: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// UPDATE USER PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      email,
      password,
      currentPassword,
      phoneNumber,
      city,
      address,
      apartment,
      longitude,
      latitude,
    } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (email !== undefined && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use",
        });
      }
      updateData.email = email;

      //Reset verification
      updateData.isAccountVerified = false;
      updateData.verifyOtp = null;
      updateData.verifyOtpExpireAt = null;
    }

    if (password && password.trim() !== "") {
      if (!currentPassword || currentPassword.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Current password is required",
        });
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        existingUser.password,
      );

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,

        location: {
          upsert: {
            create: {
              city,
              address,
              apartment,
              latitude,
              longitude,
            },
            update: {
              city,
              address,
              apartment,
              latitude,
              longitude,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        isAccountVerified: true,
        location: {
          select: {
            city: true,
            address: true,
            apartment: true,
            latitude: true,
            longitude: true,
          },
        },
        craftsman: {
          select: {
            status: true,
            isAvailable: true,
            warningLevel: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      message:
        email && email !== existingUser.email
          ? "Profile updated successfully. Please verify your new email."
          : "Profile updated successfully",
      userData: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
