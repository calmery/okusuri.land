import { createContext, useEffect, useState } from "react";
import { subscribe, Token } from "../utils/authentication";

const AuthenticationContext = createContext<{
  token: Token | null;
}>({ token: null });

const AuthenticationProvider: React.FC = (props) => {
  const [token, setToken] = useState<Token | null>(null);

  useEffect(() => {
    subscribe(setToken);
  }, []);

  return <AuthenticationContext.Provider {...props} value={{ token }} />;
};

export { AuthenticationContext, AuthenticationProvider };
