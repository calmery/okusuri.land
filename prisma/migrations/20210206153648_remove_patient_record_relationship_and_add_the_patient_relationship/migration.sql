/*
  Warnings:

  - You are about to drop the column `patientRecordId` on the `PatientDisease` table. All the data in the column will be lost.
  - Added the required column `patientId` to the `PatientDisease` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PatientDisease.departmentId_patientRecordId_index";

-- DropForeignKey
ALTER TABLE "PatientDisease" DROP CONSTRAINT "PatientDisease_patientRecordId_fkey";

-- AlterTable
ALTER TABLE "PatientDisease" DROP COLUMN "patientRecordId",
ADD COLUMN     "patientId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "PatientDisease.departmentId_patientId_index" ON "PatientDisease"("departmentId", "patientId");

-- AddForeignKey
ALTER TABLE "PatientDisease" ADD FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
