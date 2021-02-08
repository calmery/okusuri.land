import { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "~/domains";
import { actions } from "~/domains/authentication";
import { firebase } from "~/domains/authentication/utils";
import "~/utils/sentry";
import "~/styles/globals.scss";

const App = ({ Component, pageProps }: AppProps) => {
  const { query } = useRouter();
  const { debug } = query;

  useEffect(() => {
    document.oncontextmenu = () => {
      if (process.env.NODE_ENV !== "production" && debug !== undefined) {
        return true;
      }

      alert("右クリックは禁止です！");
      return false;
    };
  }, [debug]);

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
