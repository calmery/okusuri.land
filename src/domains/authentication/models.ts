import { Branded } from "../../types/Branded";
import { MedicineId } from "../../types/Medicine";

export type Token = Branded<string, "Token">;

export type UserCredential = {
  accessToken: string;
  accessTokenSecret: string;
};

export type UserProfile = {
  id: string;
  image: string;
  medicines: MedicineId[];
  name: string;
  screenName: string;
};
