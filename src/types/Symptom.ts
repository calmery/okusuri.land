import { Branded } from "./Branded";

export type SymptomId = Branded<string, "SymptomId">;

export type Symptom = {
  description: string;
  id: SymptomId;
  key: string;
  value: number;
};
