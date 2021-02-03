import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch as _useDispatch, createSelectorHook } from "react-redux";
import * as authentication from "./authentication";

const reducer = combineReducers({
  authentication: authentication.reducer,
});

export const store = configureStore({ reducer });
export const useDispatch = () => _useDispatch<typeof store.dispatch>();
export const useSelector = createSelectorHook<State>();

export type State = ReturnType<typeof store.getState>;
