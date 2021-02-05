-- CreateTable
CREATE TABLE "PatientPhysicalCondition" (
    "departmentId" TEXT NOT NULL,
    "json" JSONB NOT NULL,
    "patientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PatientPhysicalCondition.patientId_unique" ON "PatientPhysicalCondition"("patientId");

-- CreateIndex
CREATE INDEX "PatientPhysicalCondition.departmentId_patientId_index" ON "PatientPhysicalCondition"("departmentId", "patientId");

-- AddForeignKey
ALTER TABLE "PatientPhysicalCondition" ADD FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
