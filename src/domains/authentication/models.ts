import { Branded } from "../../types/Branded";
import { DiseaseId } from "../../types/Disease";

export type Token = Branded<string, "Token">;

export type PatientInsuranceCard = {
  accessToken: string;
  accessTokenSecret: string;
};

export type PatientRecord = {
  id: string;
  image: string;
  diseases: DiseaseId[];
  name: string;
  screenName: string;
};
