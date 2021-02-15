import { css, keyframes } from "@emotion/react";
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
  width: 18%;
`;

// Main

export const Page: React.FC<{ children: string }> = ({ children }) => (
  <div css={container}>
    <div css={menu}>
      <Menu />
    </div>
    <div css={border} />
    <div css={main} dangerouslySetInnerHTML={{ __html: children }} />
  </div>
);
