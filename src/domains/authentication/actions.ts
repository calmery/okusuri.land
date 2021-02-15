import { createAsyncThunk } from "@reduxjs/toolkit";
import { Token, PatientRecord } from "./models";
import { firebase, get, post } from "./utils";
import { ApiResponse } from "~/utils/api";
import { Sentry } from "~/utils/sentry";

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
      try {
        const { data } = await get<ApiResponse<PatientRecord>>("/patients");
        return data;
      } catch (error) {
        Sentry.captureException(error);

        return null;
      }
    }

    const { data } = await post<ApiResponse<PatientRecord>>("/patients", {
      accessToken: (credential as any).accessToken,
      accessTokenSecret: (credential as any).secret,
    });

    return data;
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
