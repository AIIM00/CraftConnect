-- CreateEnum
CREATE TYPE "ReassignmentStatus" AS ENUM ('PENDING_ADMIN', 'PENDING_CRAFTSMAN', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- AlterEnum
ALTER TYPE "AssignmentStatus" ADD VALUE 'TRANSFERRED';

-- CreateTable
CREATE TABLE "TaskReassignmentRequest" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "oldCraftsmanId" TEXT NOT NULL,
    "newCraftsmanId" TEXT,
    "adminId" TEXT,
    "reason" TEXT,
    "status" "ReassignmentStatus" NOT NULL DEFAULT 'PENDING_ADMIN',
    "adminMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskReassignmentRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskReassignmentRequest" ADD CONSTRAINT "TaskReassignmentRequest_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskReassignmentRequest" ADD CONSTRAINT "TaskReassignmentRequest_oldCraftsmanId_fkey" FOREIGN KEY ("oldCraftsmanId") REFERENCES "Craftsman"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskReassignmentRequest" ADD CONSTRAINT "TaskReassignmentRequest_newCraftsmanId_fkey" FOREIGN KEY ("newCraftsmanId") REFERENCES "Craftsman"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskReassignmentRequest" ADD CONSTRAINT "TaskReassignmentRequest_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
