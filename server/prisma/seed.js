import prisma from "../src/prisma.js";
import bcrypt from "bcryptjs";

const password = await bcrypt.hash("12345678", 10);

const data = [
  {
    name: "Home Repair Services",
    services: ["Handyman", "Plumber", "Locksmith", "Electrician"],
  },
  {
    name: "Finishing Services",
    services: ["Carpenter", "Tiler", "Painter", "Mason"],
  },
  {
    name: "Installation Services",
    services: ["Kitchen Installer", "Door Installer", "Window Installer"],
  },
  {
    name: "Outdoor Services",
    services: ["Fence Installer", "Gardener"],
  },
  {
    name: "Metal Services",
    services: ["Welder", "Metal Fabricator", "Blacksmith"],
  },
  {
    name: "Cleaning Services",
    services: ["Pest Control", "Deep Cleaning", "House Cleaner"],
  },
  {
    name: "Technology Services",
    services: ["Network Technician", "CCTV Installer", "Smart Home Installer"],
  },
  {
    name: "Craft Services",
    services: ["Tailor", "Jewelry Repair", "Woodworker"],
  },
];

async function main() {
  await prisma.warning.deleteMany();
  await prisma.review.deleteMany();
  await prisma.taskImage.deleteMany();
  await prisma.taskCompletion.deleteMany();
  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.taskAssignment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.categoryAssignmentQueue.deleteMany();
  await prisma.application.deleteMany();
  await prisma.location.deleteMany();
  await prisma.craftsman.deleteMany();
  await prisma.adminInvite.deleteMany();
  await prisma.user.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();

  const superAdmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@test.com",
      password,
      role: "SUPERADMIN",
      isAccountVerified: true,
    },
  });
  for (const categoryData of data) {
    const category = await prisma.category.create({
      data: { name: categoryData.name },
    });

    for (const serviceName of categoryData.services) {
      const service = await prisma.service.create({
        data: {
          name: serviceName,
          categoryId: category.id,
        },
      });

      for (let i = 1; i <= 3; i++) {
        const user = await prisma.user.create({
          data: {
            name: `${serviceName} Craftsman ${i}`,
            email: `${serviceName.toLowerCase().replaceAll(" ", ".")}.${i}@test.com`,
            password,
            role: "CRAFTSMAN",
            isAccountVerified: true,
          },
        });

        await prisma.craftsman.create({
          data: {
            userId: user.id,
            categoryId: category.id,
            serviceId: service.id,
            experience: 5 + i,
            status: "APPROVED",
            isAvailable: true,
            queueOrder: i,
            warningLevel: "NONE",
          },
        });
      }
    }
  }
  console.log("Superadmin created:");
  console.log("Email: superadmin@test.com");
  console.log("Password: 12345678");

  console.log(
    "Seed completed: categories, services, and 3 craftsmen per service created.",
  );
  console.log("Craftsman password for all test accounts: 12345678");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
