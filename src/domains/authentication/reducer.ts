import { createReducer } from "@reduxjs/toolkit";
import * as actions from "./actions";
import { Token, UserProfile } from "./models";

export type State = {
  isRefreshingProfile: boolean;
  isRefreshingToken: boolean;
  profile: UserProfile | null;
  token: Token | null;
};

const initialState: State = {
  isRefreshingProfile: false,
  isRefreshingToken: false,
  profile: null,
  token: null,
};

export const reducer = createReducer(initialState, (builder) =>
  builder
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
      state.isRefreshingToken = false;
      state.token = action.payload;
    })
    .addCase(actions.refreshToken.pending, (state) => {
      state.isRefreshingToken = true;
    })
    .addCase(actions.refreshToken.rejected, (state) => {
      state.isRefreshingToken = false;
      state.token = null;
    })
);