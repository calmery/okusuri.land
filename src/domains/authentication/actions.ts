import { createAsyncThunk } from "@reduxjs/toolkit";
import { Token, PatientRecord } from "./models";
import { firebase, get, post } from "./utils";
import { Disease } from "~/types/Disease";
import { ApiResponse } from "~/utils/api";
import { Sentry } from "~/utils/sentry";

export const logIn = createAsyncThunk("AUTHENTICATION/LOGIN", () =>
  firebase.auth().signInWithRedirect(new firebase.auth.TwitterAuthProvider())
);

export const logOut = createAsyncThunk("AUTHENTICATION/LOGOUT", () =>
  firebase.auth().signOut()
);

export const refreshProfile = createAsyncThunk<PatientRecord | null>(
  "AUTHENTICATION/REFRESH_PROFILE",
  async () => {
    const { credential } = await firebase.auth().getRedirectResult();

    if (!credential) {
      try {
        const { data } = await get<
          ApiResponse<{
            diseases: Disease[];
            record: PatientRecord;
          }>
        >("/reception");

        return data.record;
      } catch (error) {
        Sentry.captureException(error);

        return null;
      }
    }

    const { data } = await post<
      ApiResponse<{
        diseases: Disease[];
        record: PatientRecord;
      }>
    >("/reception", {
      accessToken: (credential as any).accessToken,
      accessTokenSecret: (credential as any).secret,
    });

    return data.record;
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
