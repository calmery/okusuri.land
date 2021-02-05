import { Branded } from "./Branded";
import { Disease } from "./Disease";

export type DepartmentId = Branded<string, "DepartmentId">;

export type Department = {
  description: string;
  id: DepartmentId;
  icon: { url: string };
  diseases: Disease[];
  name: string;
  url: string;
};
