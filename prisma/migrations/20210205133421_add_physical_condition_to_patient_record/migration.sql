/*
  Warnings:

  - Added the required column `physicalCondition` to the `PatientRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PatientRecord" ADD COLUMN     "physicalCondition" JSONB NOT NULL;
