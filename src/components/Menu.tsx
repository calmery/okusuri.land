import { css } from "@emotion/react";
import { useRouter } from "next/router";
import { useCallback, useLayoutEffect } from "react";
import html from "~/static/menu.html";

const container = css`
  background: url("/menu/background.gif");
  height: 100%;
`;

export const Menu: React.FC = () => {
  const { push } = useRouter();

  const handleClickLink = useCallback((event: MouseEvent) => {
    const a = event.currentTarget as HTMLAnchorElement | null;

    if (!a) {
      return;
    }

    if (window.location.origin === a.origin) {
      event.preventDefault();
      push(a.pathname);
    }
  }, []);

  useLayoutEffect(() => {
    const links = document.querySelectorAll("a");

    links.forEach((link) => link.addEventListener("click", handleClickLink));

    return () => {
      links.forEach((link) =>
        link.removeEventListener("click", handleClickLink)
      );
    };
  }, []);

  return <div css={container} dangerouslySetInnerHTML={{ __html: html }} />;
};
