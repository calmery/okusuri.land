import { createSelector } from "@reduxjs/toolkit";
import { State } from "./reducer";

export const isAuthenticated = createSelector<State, boolean, boolean, boolean>(
  (state) => !!state.profile,
  (state) => !!state.token,
  (profile, token) => profile && token
);

export const isRefreshing = createSelector<State, boolean, boolean, boolean>(
  (state) => state.isRefreshingProfile,
  (state) => state.isRefreshingToken,
  (profile, token) => profile || token
);
