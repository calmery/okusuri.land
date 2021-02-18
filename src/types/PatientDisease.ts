import { DepartmentId } from "./Department";

export type PatientDisease = {
  departmentId: DepartmentId;
  diseaseId: string;
  createdAt: string;
};
