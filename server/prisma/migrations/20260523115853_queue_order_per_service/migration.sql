/*
  Warnings:

  - A unique constraint covering the columns `[categoryId,serviceId,queueOrder]` on the table `Craftsman` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Craftsman_categoryId_queueOrder_key";

-- CreateIndex
CREATE UNIQUE INDEX "Craftsman_categoryId_serviceId_queueOrder_key" ON "Craftsman"("categoryId", "serviceId", "queueOrder");
