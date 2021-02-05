import { Branded } from "./Branded";

export type SymptomId = Branded<string, "SymptomId">;

export type Symptom = {
  defaultValue: number;
  description: string;
  id: SymptomId;
  key: string;
  maximumChange: number;
  threshold: number;
};
