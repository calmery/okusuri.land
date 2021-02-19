import { Branded } from "./Branded";

export type GraphCmsDepartmentId = Branded<string, "GraphCmsDepartmentId">;

export type GraphCmsDepartment = {
  description: string;
  id: GraphCmsDepartmentId;
  icon: { url: string };
  diseases: GraphCmsDisease[];
  name: string;
  url: string;
};

export type GraphCmsDiseaseId = Branded<string, "GraphCmsDiseaseId">;

export type GraphCmsDisease = {
  description: string;
  id: GraphCmsDiseaseId;
  medicines: GraphCmsMedicine[];
  name: string;
  symptoms: GraphCmsSymptom[];
};

export type GraphCmsMedicineId = Branded<string, "GraphCmsMedicineId">;

export type GraphCmsMedicine = {
  description: string;
  icon: { url: string };
  id: GraphCmsMedicineId;
  name: string;
};

export type GraphCmsSymptomId = Branded<string, "GraphCmsSymptomId">;

export type GraphCmsSymptom = {
  defaultValue: number;
  description: string;
  id: GraphCmsSymptomId;
  key: string;
  maximumChange: number;
  threshold: number;
};
