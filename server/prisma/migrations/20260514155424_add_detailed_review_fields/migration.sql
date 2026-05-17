-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "cleanlinessRating" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "communicationRating" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "issueTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "priceFairnessRating" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "professionalismRating" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "punctualityRating" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "qualityRating" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "wouldHireAgain" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "wouldRecommend" BOOLEAN NOT NULL DEFAULT true;
