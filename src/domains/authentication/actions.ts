import { createAction } from "@reduxjs/toolkit";
import { Token } from "../../utils/authentication";

export const updateToken = createAction<Token | null>(
  "AUTHENTICATION/UPDATE_TOKEN"
);
