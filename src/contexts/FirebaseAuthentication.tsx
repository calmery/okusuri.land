import { createContext, useEffect, useState } from "react";
import { firebase } from "../utils/firebase";

const FirebaseAuthenticationContext = createContext<{
  user: firebase.User | null;
}>({ user: null });

const FirebaseAuthenticationProvider: React.FC = (props) => {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  return <FirebaseAuthenticationContext.Provider {...props} value={{ user }} />;
};

export { FirebaseAuthenticationContext, FirebaseAuthenticationProvider };
