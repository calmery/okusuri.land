import { Branded } from "../../types/Branded";

export type Token = Branded<string, "Token">;

export type UserCredential = {
  accessToken: string;
  accessTokenSecret: string;
};

export type UserProfile = {
  id: string;
  image: string;
  name: string;
  screenName: string;
};
