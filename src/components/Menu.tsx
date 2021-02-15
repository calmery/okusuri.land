import { css } from "@emotion/react";
import html from "~/static/menu.html";

const container = css`
  background: url("/menu/background.gif");
`;

export const Menu: React.FC = () => {
  return <div css={container} dangerouslySetInnerHTML={{ __html: html }} />;
};