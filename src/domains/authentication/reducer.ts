import { createReducer } from "@reduxjs/toolkit";
import * as actions from "./actions";
import { Token } from "./models";
import { ResponseablePatientRecord } from "~/types/Responseable";

export type State = {
  firstUpdate: boolean;
  isRefreshingProfile: boolean;
  isRefreshingToken: boolean;
  profile: ResponseablePatientRecord | null;
  token: Token | null;
};

const initialState: State = {
  firstUpdate: false,
  isRefreshingProfile: false,
  isRefreshingToken: false,
  profile: null,
  token: null,
};

export const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(actions.logOut.fulfilled, (state) => {
      state.profile = initialState.profile;
    })
    .addCase(actions.refreshProfile.fulfilled, (state, action) => {
      state.isRefreshingProfile = false;
      state.profile = action.payload;
    })
    .addCase(actions.refreshProfile.pending, (state) => {
      state.isRefreshingProfile = true;
    })
    .addCase(actions.refreshProfile.rejected, (state) => {
      state.isRefreshingProfile = false;
      state.profile = null;
    })
    .addCase(actions.refreshToken.fulfilled, (state, action) => {
      state.firstUpdate = true;
      state.isRefreshingToken = false;
      state.token = action.payload;
    })
    .addCase(actions.refreshToken.pending, (state) => {
      state.isRefreshingToken = true;
    })
    .addCase(actions.refreshToken.rejected, (state) => {
      state.firstUpdate = true;
      state.isRefreshingToken = false;
      state.token = null;
    })
);
