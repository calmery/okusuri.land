import { css, keyframes } from "@emotion/react";
import Head from "next/head";
import React from "react";
import { BlogSwitch } from "./BlogSwitch";
import { Menu } from "./Menu";

// Animations

const blinkKeyframes = keyframes`
  0%, 50% {
    visibility: hidden;
  }

  100% {
    visibility: visible;
  }
`;

// Styles

const border = css`
  background: #d0d0d0;
  border-left: 1px solid #aaaaaa;
  border-right: 1px solid #000000;
  cursor: col-resize;
  height: 100%;
  width: 4px;
`;

const container = css`
  display: flex;
  height: 100%;

  blink {
    animation: 2s linear infinite ${blinkKeyframes};
  }
`;

const main = css`
  background: url("/background.gif");
  flex-grow: 1;
  height: 100%;
  overflow: scroll;
`;

const menu = css`
  flex-shrink: 0;
  width: 18%;
`;

// Main

export const Page: React.FC<{
  children?: React.ReactNode | string;
  title?: string;
}> = ({ children, title }) => (
  <>
    <Head>
      <title>{title ? `${title} / おくすりランド` : "おくすりランド"}</title>
      <script src="/externals/130719tinkerbell-min.js"></script>
    </Head>
    <div css={container}>
      <div css={menu}>
        <Menu />
      </div>
      <div css={border} />
      <div css={main}>
        {typeof children === "string" && (
          <div dangerouslySetInnerHTML={{ __html: children }} />
        )}
        {typeof children !== "string" && children}
        <BlogSwitch />
      </div>
    </div>
  </>
);
