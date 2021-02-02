import { AppProps } from "next/app";
import { FirebaseAuthenticationProvider } from "../contexts/FirebaseAuthentication";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseAuthenticationProvider>
      <Component {...pageProps} />
    </FirebaseAuthenticationProvider>
  );
}

export default MyApp;
