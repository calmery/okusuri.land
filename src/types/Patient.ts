import { PatientDisease } from "./PatientDisease";
import { PatientRecord } from "~/domains/authentication/models";

export type Patient = {
  diseases: PatientDisease[];
  record: PatientRecord;
};
