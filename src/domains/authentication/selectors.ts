import { createSelector } from "@reduxjs/toolkit";
import { State } from "..";

export const isRefreshing = createSelector<
  State,
  boolean,
  boolean,
  boolean,
  boolean
>(
  (state) => state.authentication.firstUpdate,
  (state) => state.authentication.isRefreshingProfile,
  (state) => state.authentication.isRefreshingToken,
  (firstUpdate, profile, token) => !firstUpdate || profile || token
);

export const profile = (state: State) => state.authentication.profile;
