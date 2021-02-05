import { Branded } from "./Branded";

export type MedicineId = Branded<string, "MedicineId">;

export type Medicine = {
  description: string;
  icon: { url: string };
  id: MedicineId;
  name: string;
};
