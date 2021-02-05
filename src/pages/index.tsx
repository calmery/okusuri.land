import { useCallback } from "react";
import { useDispatch } from "~/domains";
import { actions } from "~/domains/authentication";

const Index: React.FC = () => {
  const dispatch = useDispatch();

  const handleClickLogInButton = useCallback(() => {
    dispatch(actions.authenticate());
  }, []);

  return <button onClick={handleClickLogInButton}>Log in with Twitter</button>;
};

export default Index;
