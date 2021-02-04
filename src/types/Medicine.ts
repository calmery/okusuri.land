import { Symptom } from "./Symptom";

export type Medicine = {
  description: string;
  icon: { url: string };
  id: string;
  name: string;
  symptoms: Symptom[];
};
