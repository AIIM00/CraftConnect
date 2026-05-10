/*
  Warnings:

  - You are about to drop the column `userId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT IF EXISTS "Task_userId_fkey";

-- AlterTable

ALTER TABLE "Task" RENAME COLUMN "userId" TO "customerId";

ALTER TABLE "Task" ADD CONSTRAINT "Task_customerId_fkey"
FOREIGN KEY ("customerId") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;