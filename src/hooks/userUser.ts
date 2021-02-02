import { useContext } from "react";
import { FirebaseAuthenticationContext } from "../contexts/FirebaseAuthentication";

export const useUser = () => useContext(FirebaseAuthenticationContext);
