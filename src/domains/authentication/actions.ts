import { createAsyncThunk } from "@reduxjs/toolkit";
import { Token } from "./models";
import { firebase, get, post } from "./utils";
import { PatientInsuranceCard } from "~/types/PatientInsuranceCard";
import {
  ResponseablePatient,
  ResponseablePatientRecord,
} from "~/types/Responseable";
import { ApiResponse } from "~/utils/api";
import { Sentry } from "~/utils/sentry";

export const logIn = createAsyncThunk("AUTHENTICATION/LOGIN", () =>
  firebase.auth().signInWithRedirect(new firebase.auth.TwitterAuthProvider())
);

export const logOut = createAsyncThunk("AUTHENTICATION/LOGOUT", () =>
  firebase.auth().signOut()
);

export const refreshProfile = createAsyncThunk<ResponseablePatientRecord | null>(
  "AUTHENTICATION/REFRESH_PROFILE",
  async () => {
    const { credential } = await firebase.auth().getRedirectResult();

    if (!credential) {
      try {
        const { data } = await get<ApiResponse<ResponseablePatient>>(
          "/reception"
        );

        return data.record;
      } catch (error) {
        Sentry.captureException(error);

        return null;
      }
    }

    const payload: PatientInsuranceCard = {
      accessToken: (credential as any).accessToken,
      accessTokenSecret: (credential as any).secret,
    };

    const { data } = await post<ApiResponse<ResponseablePatient>>(
      "/reception",
      payload
    );

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
