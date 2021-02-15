import { useRouter } from "next/router";
import React, { useCallback, useEffect, useLayoutEffect } from "react";
import { Page } from "~/components/Page";
import { useDispatch, useSelector } from "~/domains";
import { actions, selectors } from "~/domains/authentication";
import html from "~/static/okusuri.html";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const { push } = useRouter();
  const profile = useSelector(selectors.profile);

  const handleClickLogInButton = useCallback(() => {
    dispatch(actions.authenticate());
  }, []);

  useEffect(() => {
    if (profile) {
      push(`/~${profile.screenName}/index.htm`);
    }
  }, [profile]);

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
