-- AlterEnum
ALTER TYPE "TaskStatus" ADD VALUE 'UNASSIGNABLE';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "becameUnassignableAt" TIMESTAMP(3),
ADD COLUMN     "lastAssignmentAttemptAt" TIMESTAMP(3);
