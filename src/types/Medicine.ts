import { Branded } from "./Branded";
import { Symptom } from "./Symptom";

export type MedicineId = Branded<string, "MedicineId">;

export type Medicine = {
  description: string;
  icon: { url: string };
  id: MedicineId;
  name: string;
  symptoms: Symptom[];
};
