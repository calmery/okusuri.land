import { AppProps } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../domains";
import "../styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
