import { Department, DepartmentId } from "./Department";
import { Disease, DiseaseId } from "./Disease";
import { Medicine } from "./Medicine";

export type ResponseableDepartment = Pick<
  Department,
  "description" | "id" | "icon" | "name" | "url"
> & {
  diseases: (Pick<Disease, "description" | "name"> & {
    medicines: Pick<Medicine, "description" | "icon" | "name">[];
  })[];
};

// Patient

export type ResponseablePatient = {
  diseases: ResponseablePatientDisease[];
  record: ResponseablePatientRecord;
};

export type ResponseablePatientDisease = {
  departmentId: DepartmentId;
  diseaseId: string;
  createdAt: string;
};

export type ResponseablePatientRecord = {
  image: string;
  name: string;
  screenName: string;
};

// Prescription

export type ResponseablePrescription = {
  prescription: {
    diseases: DiseaseId[];
  };
};
