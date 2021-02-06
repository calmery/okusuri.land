import { Disease } from "./Disease";
import { Medicine } from "./Medicine";

export type Prescription = {
  diseases: Pick<Disease, "description" | "name"> &
    {
      medicines: Pick<Medicine, "description" | "icon" | "name">[];
    }[];
};
