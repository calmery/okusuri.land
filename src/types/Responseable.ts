import {
  GraphCmsDepartment,
  GraphCmsDepartmentId,
  GraphCmsDisease,
  GraphCmsDiseaseId,
  GraphCmsMedicine,
} from "./GraphCMS";

export type ResponseableDisease = Pick<
  GraphCmsDisease,
  "description" | "id" | "name"
> & {
  medicines: Pick<GraphCmsMedicine, "description" | "icon" | "name">[];
};

export type ResponseableDepartment = Pick<
  GraphCmsDepartment,
  "description" | "id" | "icon" | "name" | "url"
> & {
  diseases: ResponseableDisease[];
};

// Patient

export type ResponseablePatient = {
  diseases: ResponseablePatientDisease[];
  record: ResponseablePatientRecord;
};

export type ResponseablePatientDisease = {
  departmentId: GraphCmsDepartmentId;
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
    diseases: GraphCmsDiseaseId[];
  };
};
