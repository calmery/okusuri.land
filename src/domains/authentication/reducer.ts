import { createReducer } from "@reduxjs/toolkit";
import { Token } from "../../utils/authentication";
import * as actions from "./actions";

export type State = {
  token: Token | null;
};

const initialState: State = {
  token: null,
};

export const reducer = createReducer(initialState, (builder) =>
  builder.addCase(actions.updateToken, (state, action) => {
    state.token = action.payload;
  })
);
