import { PatientDisease, PatientRecord } from "@prisma/client";
import { Department, DepartmentId } from "~/types/Department";
import {
  ResponseableDepartment,
  ResponseablePatient,
} from "~/types/Responseable";

export const convertDepartmentToResponseableDepartment = (
  department: Department
): ResponseableDepartment => ({
  description: department.description,
  diseases: department.diseases.map((disease) => ({
    description: disease.description,
    medicines: disease.medicines.map((medicine) => ({
      description: medicine.description,
      icon: medicine.icon,
      name: medicine.name,
    })),
    name: disease.name,
  })),
  id: department.id,
  icon: department.icon,
  name: department.name,
  url: department.url,
});

export const createResponseablePatient = (
  patientDiseases: PatientDisease[],
  patientRecord: PatientRecord
): ResponseablePatient => ({
  diseases: patientDiseases.map((patientDisease) => ({
    createdAt: patientDisease.createdAt.toString(),
    departmentId: patientDisease.departmentId as DepartmentId,
    diseaseId: patientDisease.diseaseId,
  })),
  record: {
    image: patientRecord.image,
    name: patientRecord.name,
    screenName: patientRecord.screenName,
  },
});
