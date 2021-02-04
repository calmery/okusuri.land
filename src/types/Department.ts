import { Branded } from "./Branded";
import { Medicine } from "./Medicine";

export type DepartmentId = Branded<string, "DepartmentId">;

export type Department = {
  description: string;
  id: DepartmentId;
  icon: { url: string };
  medicines: Medicine[];
  name: string;
  url: string;
};
