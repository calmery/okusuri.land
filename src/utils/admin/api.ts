import { PatientDisease, PatientRecord } from "@prisma/client";
import { GraphCmsDepartment, GraphCmsDepartmentId } from "~/types/GraphCMS";
import {
  ResponseableDepartment,
  ResponseablePatient,
} from "~/types/Responseable";

export const convertDepartmentToResponseableDepartment = (
  department: GraphCmsDepartment
): ResponseableDepartment => ({
  description: department.description,
  diseases: department.diseases.map((disease) => ({
    description: disease.description,
    id: disease.id,
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
    departmentId: patientDisease.departmentId as GraphCmsDepartmentId,
    diseaseId: patientDisease.diseaseId,
  })),
  record: {
    image: patientRecord.image,
    name: patientRecord.name,
    screenName: patientRecord.screenName,
  },
});
