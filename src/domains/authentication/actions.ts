import { createAsyncThunk } from "@reduxjs/toolkit";
import { Token, PatientRecord } from "./models";
import { firebase, post } from "./utils";

export const authenticate = createAsyncThunk(
  "AUTHENTICATION/AUTHENTICATE",
  () =>
    firebase.auth().signInWithRedirect(new firebase.auth.TwitterAuthProvider())
);

export const refreshProfile = createAsyncThunk<PatientRecord | null>(
  "AUTHENTICATION/REFRESH_PROFILE",
  async () => {
    const { credential } = await firebase.auth().getRedirectResult();

    if (!credential) {
      return null;
    }

    return await post<PatientRecord>("/patients", {
      accessToken: (credential as any).accessToken,
      accessTokenSecret: (credential as any).secret,
    });
  }
);

export const refreshToken = createAsyncThunk<Token | null>(
  "AUTHENTICATION/REFRESH_TOKEN",
  async () => {
    const { currentUser } = firebase.auth();

    if (!currentUser) {
      return null;
    }

    return (await currentUser.getIdToken(true)) as Token;
  }
);
