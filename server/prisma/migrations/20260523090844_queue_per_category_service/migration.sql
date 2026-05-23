/*
  Warnings:

  - The primary key for the `CategoryAssignmentQueue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[categoryId,serviceId]` on the table `CategoryAssignmentQueue` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `CategoryAssignmentQueue` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `serviceId` on table `CategoryAssignmentQueue` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CategoryAssignmentQueue" DROP CONSTRAINT "CategoryAssignmentQueue_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "serviceId" SET NOT NULL,
ADD CONSTRAINT "CategoryAssignmentQueue_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryAssignmentQueue_categoryId_serviceId_key" ON "CategoryAssignmentQueue"("categoryId", "serviceId");

-- AddForeignKey
ALTER TABLE "CategoryAssignmentQueue" ADD CONSTRAINT "CategoryAssignmentQueue_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
