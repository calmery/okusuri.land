/*
  Warnings:

  - Added the required column `departmentId` to the `PatientDisease` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PatientDisease" ADD COLUMN     "departmentId" TEXT NOT NULL;
