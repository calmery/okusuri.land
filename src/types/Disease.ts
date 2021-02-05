import { Branded } from "./Branded";
import { Symptom } from "./Symptom";

export type DiseaseId = Branded<string, "DiseaseId">;

export type Disease = {
  description: string;
  icon: { url: string };
  id: DiseaseId;
  name: string;
  symptoms: Symptom[];
};
