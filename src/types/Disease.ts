import { Branded } from "./Branded";
import { Medicine } from "./Medicine";
import { Symptom } from "./Symptom";

export type DiseaseId = Branded<string, "DiseaseId">;

export type Disease = {
  description: string;
  icon: { url: string };
  id: DiseaseId;
  medicines: Medicine[];
  name: string;
  symptoms: Symptom[];
};
