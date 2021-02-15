import React, { useCallback, useLayoutEffect } from "react";
import { Page } from "~/components/Page";
import { useDispatch } from "~/domains";
import { actions } from "~/domains/authentication";
import html from "~/static/login.html";

const Login: React.FC = () => {
  const dispatch = useDispatch();

  const handleClickLogInButton = useCallback(() => {
    dispatch(actions.authenticate());
  }, []);

  useLayoutEffect(() => {
    const loginButton = document.getElementById("login");

    if (!loginButton) {
      return;
    }

    loginButton.addEventListener("click", handleClickLogInButton);

    return () => {
      loginButton.removeEventListener("click", handleClickLogInButton);
    };
  }, [handleClickLogInButton]);

  return <Page>{html}</Page>;
};

export default Login;
