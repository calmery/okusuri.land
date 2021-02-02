import { useCallback, useEffect } from "react";
import { firebase } from "../utils/firebase";
import { useUser } from "../hooks/userUser";

const Index: React.FC = () => {
  const { user } = useUser();

  // Events

  const handleClickLogInButton = useCallback(() => {
    firebase.auth().signInWithRedirect(new firebase.auth.TwitterAuthProvider());
  }, []);

  // Side Effects

  useEffect(() => {
    console.log(user);
  }, [user]);

  // Render

  return <button onClick={handleClickLogInButton}>Log in with Twitter</button>;
};

export default Index;
