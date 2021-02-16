import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useLayoutEffect } from "react";
import { Page } from "~/components/Page";
import { useDispatch, useSelector } from "~/domains";
import { actions, selectors } from "~/domains/authentication";
import html from "~/static/okusuri.html";

const Okusuri: React.FC = () => {
  const dispatch = useDispatch();
  const { push } = useRouter();
  const isRefreshing = useSelector(selectors.isRefreshing);
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

  if (isRefreshing || profile) {
    return <Page title="おくすり手帳" />;
  }

  return <Page title="おくすり手帳">{html}</Page>;
};

export default dynamic(() => Promise.resolve(Okusuri), {
  ssr: false,
});
