import { createSelector } from "@reduxjs/toolkit";
import { State } from "..";

export const isRefreshing = createSelector<State, boolean, boolean, boolean>(
  (state) => state.authentication.isRefreshingProfile,
  (state) => state.authentication.isRefreshingToken,
  (profile, token) => profile || token
);

export const profile = (state: State) => state.authentication.profile;
