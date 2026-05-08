-- AlterTable
ALTER TABLE "Craftsman" ADD COLUMN     "serviceId" TEXT;

-- AddForeignKey
ALTER TABLE "Craftsman" ADD CONSTRAINT "Craftsman_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
