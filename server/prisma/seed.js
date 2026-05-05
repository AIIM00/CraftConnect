import prisma from "../src/prisma.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const categoriesData = [
  {
    name: "Home Repair",

    services: ["Plumber", "Electrician", "Handyman", "Locksmith"],
  },
  {
    name: "Construction & Renovation",
    services: ["Carpenter", "Mason", "Painter", "Tiler"],
  },
  {
    name: "Installation Services",
    services: ["Door Installer", "Window Installer", "Kitchen Installer"],
  },
  {
    name: "Outdoor & Garden",
    services: ["Landscaper", "Gardener", "Fence Installer"],
  },
  {
    name: "Metal Work",
    services: ["Welder", "Blacksmith", "Metal Fabricator"],
  },
  {
    name: "Cleaning Services",
    services: ["House Cleaner", "Deep Cleaning", "Pest Control"],
  },
  {
    name: "Technical & Smart Home",
    services: ["Smart Home Installer", "CCTV Installer", "Network Technician"],
  },
  {
    name: "Custom Crafts",
    services: ["Woodworker", "Tailor", "Jewelry Repair"],
  },
];

async function main() {
  console.log("Seeding...");

  const password = await bcrypt.hash("Pass1234!", 10);

  // Clean in FK-safe order
  await prisma.warning.deleteMany();
  await prisma.review.deleteMany();
  await prisma.taskAssignment.deleteMany();
  await prisma.taskImage.deleteMany();
  await prisma.taskCompletion.deleteMany();
  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.task.deleteMany();
  await prisma.application.deleteMany();
  await prisma.adminInvite.deleteMany();
  await prisma.location.deleteMany();
  await prisma.craftsman.deleteMany();

  // Important: delete services before categories
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();

  await prisma.user.deleteMany();

  // Categories + Services
  const categoryMap = {};

  for (const category of categoriesData) {
    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
        iconKey: category.iconKey,
        services: {
          create: category.services.map((serviceName) => ({
            name: serviceName,
          })),
        },
      },
      include: {
        services: true,
      },
    });

    categoryMap[category.name] = createdCategory;
  }

  const homeRepair = categoryMap["Home Repair"];
  const construction = categoryMap["Construction & Renovation"];
  const cleaning = categoryMap["Cleaning Services"];

  // Superadmin
  const superadmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@equiserve.com",
      password,
      role: "SUPERADMIN",
      isAccountVerified: true,
      phoneNumber: "01000000000",
    },
  });

  // Admin
  const admin = await prisma.user.create({
    data: {
      name: "Maya Admin",
      email: "admin@equiserve.com",
      password,
      role: "ADMIN",
      isAccountVerified: true,
      phoneNumber: "01000000001",
    },
  });

  // Customers
  const ali = await prisma.user.create({
    data: {
      name: "Ali Customer",
      email: "ali.customer@test.com",
      password,
      role: "CUSTOMER",
      isAccountVerified: true,
      phoneNumber: "01011111111",
      location: {
        create: {
          city: "Cairo",
          address: "Maadi",
          apartment: "12A",
        },
      },
    },
  });

  const sara = await prisma.user.create({
    data: {
      name: "Sara Customer",
      email: "sara.customer@test.com",
      password,
      role: "CUSTOMER",
      isAccountVerified: true,
      phoneNumber: "01022222222",
      location: {
        create: {
          city: "Giza",
          address: "Dokki",
          apartment: "5B",
        },
      },
    },
  });

  const jaafar = await prisma.user.create({
    data: {
      name: "Jaafar Customer",
      email: "jaafar.customer@test.com",
      password,
      role: "CUSTOMER",
      isAccountVerified: false,
      phoneNumber: "01033333333",
      verifyOtp: "123456",
      verifyOtpExpireAt: new Date(Date.now() + 10 * 60 * 1000),
      resetOtp: "654321",
      resetOtpExpireAt: new Date(Date.now() + 10 * 60 * 1000),
      location: {
        create: {
          city: "Alexandria",
          address: "Smouha",
          apartment: "9C",
        },
      },
    },
  });

  // Craftsmen
  const ahmed = await prisma.user.create({
    data: {
      name: "Ahmed Plumber",
      email: "ahmed.plumber@test.com",
      password,
      role: "CRAFTSMAN",
      isAccountVerified: true,
      phoneNumber: "01044444444",
      craftsman: {
        create: {
          category: {
            connect: { id: homeRepair.id },
          },
          experience: 6,
          status: "APPROVED",
          isAvailable: false,
          warningLevel: "NONE",
        },
      },
    },
    include: { craftsman: true },
  });

  const youssef = await prisma.user.create({
    data: {
      name: "Youssef Electrician",
      email: "youssef.electric@test.com",
      password,
      role: "CRAFTSMAN",
      isAccountVerified: true,
      phoneNumber: "01055555555",
      craftsman: {
        create: {
          category: {
            connect: { id: homeRepair.id },
          },
          experience: 4,
          status: "APPROVED",
          isAvailable: true,
          warningLevel: "NONE",
        },
      },
    },
    include: { craftsman: true },
  });

  const hany = await prisma.user.create({
    data: {
      name: "Hany Carpenter",
      email: "hany.carpenter@test.com",
      password,
      role: "CRAFTSMAN",
      isAccountVerified: true,
      phoneNumber: "01066666666",
      craftsman: {
        create: {
          category: {
            connect: { id: construction.id },
          },
          experience: 8,
          status: "SUSPENDED",
          isAvailable: true,
          warningLevel: "NONE",
        },
      },
    },
    include: { craftsman: true },
  });

  const mostafa = await prisma.user.create({
    data: {
      name: "Mostafa Painter",
      email: "mostafa.painter@test.com",
      password,
      role: "CRAFTSMAN",
      isAccountVerified: false,
      phoneNumber: "01077777777",
      verifyOtp: "111222",
      verifyOtpExpireAt: new Date(Date.now() + 10 * 60 * 1000),
      craftsman: {
        create: {
          category: {
            connect: { id: homeRepair.id },
          },
          status: "PENDING",
          isAvailable: true,
          warningLevel: "NONE",
        },
      },
    },
    include: { craftsman: true },
  });

  // Application
  await prisma.application.create({
    data: {
      userId: mostafa.id,
      categoryId: construction.id,
      yearsOfExperience: 3,
      city: "Cairo",
      address1: "Nasr City",
      apartment: "12B",
      workingDays: ["Sunday", "Monday", "Tuesday"],
      workingHours: {
        from: "09:00",
        to: "17:00",
      },
      maxTravelDistance: 20,
      scenarioQA: {
        lateArrival: "Inform customer and reschedule if needed",
      },
      workBehaviorQA: {
        conflictHandling: "Stay calm and contact support",
      },
      step: 4,
      status: "SUBMITTED",
    },
  });

  const draftCraftsman = await prisma.user.create({
    data: {
      name: "Karim Draft",
      email: "karim.draft@test.com",
      password,
      role: "CRAFTSMAN",
      isAccountVerified: true,
      phoneNumber: "01088881111",
      craftsman: {
        create: {
          status: "PENDING",
          isAvailable: true,
          warningLevel: "NONE",
        },
      },
    },
  });

  await prisma.application.create({
    data: {
      userId: draftCraftsman.id,
      categoryId: cleaning.id,
      yearsOfExperience: 2,
      city: "Cairo",
      address1: "Heliopolis",
      apartment: "4A",
      step: 2,
      status: "DRAFT",
    },
  });

  // Admin invites
  const validInviteToken = crypto.randomBytes(16).toString("hex");
  const usedInviteToken = crypto.randomBytes(16).toString("hex");
  const expiredInviteToken = crypto.randomBytes(16).toString("hex");

  await prisma.adminInvite.create({
    data: {
      email: "new.admin@test.com",
      token: validInviteToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      used: false,
      createdBy: superadmin.id,
    },
  });

  await prisma.adminInvite.create({
    data: {
      email: "used.admin@test.com",
      token: usedInviteToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      used: true,
      createdBy: superadmin.id,
    },
  });

  await prisma.adminInvite.create({
    data: {
      email: "expired.admin@test.com",
      token: expiredInviteToken,
      expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      used: false,
      createdBy: superadmin.id,
    },
  });

  // Tasks
  const pendingPlumbingTask = await prisma.task.create({
    data: {
      userId: ali.id,
      categoryId: homeRepair.id,
      title: "Service request for Plumber",
      description: "Kitchen sink leaking",
      location: "Cairo - Maadi",
      status: "PENDING",
    },
  });

  const pendingElectricalTask = await prisma.task.create({
    data: {
      userId: sara.id,
      categoryId: homeRepair.id,
      title: "Service request for Electrician",
      description: "Power outlet not working",
      location: "Giza - Dokki",
      status: "PENDING",
    },
  });

  const inProgressAhmed = await prisma.task.create({
    data: {
      userId: ali.id,
      categoryId: homeRepair.id,
      craftsmanId: ahmed.id,
      title: "Service request for Plumber",
      description: "Bathroom pipe replacement",
      location: "Cairo - Heliopolis",
      status: "IN_PROGRESS",
    },
  });

  const completedAhmed1 = await prisma.task.create({
    data: {
      userId: ali.id,
      categoryId: homeRepair.id,
      craftsmanId: ahmed.id,
      title: "Service request for Plumber",
      description: "Water heater maintenance",
      location: "Cairo - New Cairo",
      status: "COMPLETED",
    },
  });

  const completedAhmed2 = await prisma.task.create({
    data: {
      userId: sara.id,
      categoryId: homeRepair.id,
      craftsmanId: ahmed.id,
      title: "Service request for Plumber",
      description: "Blocked drain repair",
      location: "Cairo - Nasr City",
      status: "COMPLETED",
    },
  });

  const completedAhmed3 = await prisma.task.create({
    data: {
      userId: ali.id,
      categoryId: homeRepair.id,
      craftsmanId: ahmed.id,
      title: "Service request for Plumber",
      description: "Pipe leakage inspection",
      location: "Cairo - Zamalek",
      status: "COMPLETED",
    },
  });

  const completedYoussef1 = await prisma.task.create({
    data: {
      userId: sara.id,
      categoryId: homeRepair.id,
      craftsmanId: youssef.id,
      title: "Service request for Electrician",
      description: "Ceiling fan wiring",
      location: "Giza - Sheikh Zayed",
      status: "COMPLETED",
    },
  });

  const completedHany1 = await prisma.task.create({
    data: {
      userId: jaafar.id,
      categoryId: construction.id,
      craftsmanId: hany.id,
      title: "Service request for Carpenter",
      description: "Wardrobe hinge repair",
      location: "Alexandria - Smouha",
      status: "COMPLETED",
    },
  });

  // Task assignments
  await prisma.taskAssignment.create({
    data: {
      taskId: pendingPlumbingTask.id,
      craftsmanId: ahmed.id,
      status: "PENDING",
    },
  });

  await prisma.taskAssignment.create({
    data: {
      taskId: pendingElectricalTask.id,
      craftsmanId: youssef.id,
      status: "PENDING",
    },
  });

  await prisma.taskAssignment.create({
    data: {
      taskId: pendingElectricalTask.id,
      craftsmanId: ahmed.id,
      status: "DECLINED",
      respondedAt: new Date(),
    },
  });

  // Task completions
  const ahmedCompletion1 = await prisma.taskCompletion.create({
    data: {
      taskId: completedAhmed1.id,
      craftsmanId: ahmed.id,
      notes: "Completed successfully",
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  });

  const ahmedCompletion2 = await prisma.taskCompletion.create({
    data: {
      taskId: completedAhmed2.id,
      craftsmanId: ahmed.id,
      notes: "Resolved after pipe replacement",
      completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  });

  const ahmedCompletion3 = await prisma.taskCompletion.create({
    data: {
      taskId: completedAhmed3.id,
      craftsmanId: ahmed.id,
      notes: "Inspection completed and issue fixed",
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  const youssefCompletion1 = await prisma.taskCompletion.create({
    data: {
      taskId: completedYoussef1.id,
      craftsmanId: youssef.id,
      notes: "Wiring repaired",
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.taskCompletion.create({
    data: {
      taskId: completedHany1.id,
      craftsmanId: hany.id,
      notes: "Hinges replaced",
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  // Completion images
  await prisma.taskImage.createMany({
    data: [
      {
        taskCompletionId: ahmedCompletion1.id,
        imageUrl: "https://example.com/task-completion/ahmed-1.jpg",
      },
      {
        taskCompletionId: ahmedCompletion2.id,
        imageUrl: "https://example.com/task-completion/ahmed-2.jpg",
      },
      {
        taskCompletionId: ahmedCompletion3.id,
        imageUrl: "https://example.com/task-completion/ahmed-3.jpg",
      },
      {
        taskCompletionId: youssefCompletion1.id,
        imageUrl: "https://example.com/task-completion/youssef-1.jpg",
      },
    ],
  });

  // Projects
  const ahmedProject = await prisma.project.create({
    data: {
      craftsmanId: ahmed.id,
      title: "Bathroom plumbing renovation",
      description: "Full plumbing upgrade for a residential bathroom",
    },
  });

  await prisma.projectImage.createMany({
    data: [
      {
        projectId: ahmedProject.id,
        imageUrl: "https://example.com/projects/ahmed-project-1.jpg",
      },
      {
        projectId: ahmedProject.id,
        imageUrl: "https://example.com/projects/ahmed-project-2.jpg",
      },
    ],
  });

  // Reviews
  await prisma.review.create({
    data: {
      taskId: completedAhmed1.id,
      userId: ali.id,
      craftsmanId: ahmed.id,
      rating: 5,
      comment: "Very professional and on time",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.review.create({
    data: {
      taskId: completedYoussef1.id,
      userId: sara.id,
      craftsmanId: youssef.id,
      rating: 3,
      comment: "Work was okay but took longer than expected",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // Warnings
  await prisma.warning.create({
    data: {
      message: "Arrived late to the customer without notice",
      taskId: completedAhmed1.id,
      craftsmanId: ahmed.id,
      adminId: admin.id,
    },
  });

  await prisma.warning.create({
    data: {
      message: "Left the work area unclean",
      taskId: completedAhmed2.id,
      craftsmanId: ahmed.id,
      adminId: admin.id,
    },
  });

  await prisma.warning.create({
    data: {
      message: "Customer reported poor communication",
      taskId: completedAhmed3.id,
      craftsmanId: ahmed.id,
      adminId: admin.id,
    },
  });

  await prisma.craftsman.update({
    where: { userId: ahmed.id },
    data: { warningLevel: "HIGH" },
  });

  console.log("Seed completed.");
  console.log("");
  console.log("Login accounts:");
  console.log("SUPERADMIN: superadmin@equiserve.com / Pass1234!");
  console.log("ADMIN: admin@equiserve.com / Pass1234!");
  console.log("CUSTOMER: ali.customer@test.com / Pass1234!");
  console.log("CUSTOMER: sara.customer@test.com / Pass1234!");
  console.log("UNVERIFIED CUSTOMER: jaafar.customer@test.com / Pass1234!");
  console.log("CRAFTSMAN APPROVED: ahmed.plumber@test.com / Pass1234!");
  console.log("CRAFTSMAN APPROVED: youssef.electric@test.com / Pass1234!");
  console.log("CRAFTSMAN SUSPENDED: hany.carpenter@test.com / Pass1234!");
  console.log("CRAFTSMAN PENDING: mostafa.painter@test.com / Pass1234!");
  console.log("");
  console.log("Test OTPs:");
  console.log("Jaafar verify OTP: 123456");
  console.log("Jaafar reset OTP: 654321");
  console.log("Mostafa verify OTP: 111222");
  console.log("");
  console.log("Admin invite tokens:");
  console.log(`Valid invite: ${validInviteToken}`);
  console.log(`Used invite: ${usedInviteToken}`);
  console.log(`Expired invite: ${expiredInviteToken}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
