import { AppProps } from "next/app";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../domains";
import { actions } from "../domains/authentication";
import { firebase } from "../domains/authentication/utils";
import "../styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async () => {
      await store.dispatch(actions.refreshToken());
      await store.dispatch(actions.refreshProfile());
    });
  }, []);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
