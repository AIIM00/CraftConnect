-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "customCategory" TEXT,
ADD COLUMN     "customService" TEXT,
ADD COLUMN     "serviceId" TEXT;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
