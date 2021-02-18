import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { DefaultHead } from "~/components/DefaultHead";
import { store } from "~/domains";
import { actions } from "~/domains/authentication";
import { firebase } from "~/domains/authentication/utils";
import "~/utils/sentry";
import "~/styles/globals.scss";
import * as GA from "~/utils/google-analytics";
import { defaultSeoProps } from "~/utils/next-seo";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { debug } = router.query;

  useEffect(() => {
    router.events.on("routeChangeComplete", GA.changeRoute);

    return () => {
      router.events.off("routeChangeComplete", GA.changeRoute);
    };
  }, [router.events]);

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
    <>
      <DefaultHead />
      <DefaultSeo {...defaultSeoProps} />
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
};

export default App;
