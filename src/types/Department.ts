import { Medicine } from "./Medicine";

export type Department = {
  description: string;
  id: string;
  icon: { url: string };
  medicines: Medicine[];
  name: string;
  url: string;
};
