import { Branded } from "~/types/Branded";

export type Token = Branded<string, "Token">;

export type PatientInsuranceCard = {
  accessToken: string;
  accessTokenSecret: string;
};

export type PatientRecord = {
  id: string;
  image: string;
  name: string;
  screenName: string;
};
