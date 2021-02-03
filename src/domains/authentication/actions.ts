import { createAsyncThunk } from "@reduxjs/toolkit";
import { Token, UserProfile } from "./models";
import { firebase, post } from "./utils";

export const authenticate = createAsyncThunk(
  "AUTHENTICATION/AUTHENTICATE",
  () =>
    firebase.auth().signInWithRedirect(new firebase.auth.TwitterAuthProvider())
);

export const refreshProfile = createAsyncThunk<UserProfile | null>(
  "AUTHENTICATION/REFRESH_PROFILE",
  async () => {
    const { credential } = await firebase.auth().getRedirectResult();

    if (!credential) {
      return null;
    }

    return await post<UserProfile>("/users", {
      accessToken: (credential as any).accessToken,
      accessTokenSecret: (credential as any).secret,
    });
  }
);

export const refreshToken = createAsyncThunk<Token | null>(
  "AUTHENTICATION/REFRESH_TOKEN",
  async () => {
    const user = firebase.auth().currentUser;

    if (!user) {
      return null;
    }

    return (await user.getIdToken(true)) as Token;
  }
);
