import { css } from "@emotion/react";
import { NextPage } from "next";
import React, { useCallback, useState } from "react";
import { Page } from "~/components/Page";

const clickable = css`
  cursor: pointer;
`;

const Omikuji: NextPage = () => {
  const [index, setIndex] = useState<number | null>(null);

  const handleDraw = useCallback(() => {
    setIndex(Math.floor(Math.random() * 20));
  }, []);

  return (
    <Page title="おみくじ">
      {index === null && (
        <img css={clickable} onClick={handleDraw} src="/omikuji.png" />
      )}
      {index !== null && (
        <>
          <img src={`/omikuji/${index}.png`} />
          <br />
          <span
            css={clickable}
            onClick={handleDraw}
            style={{
              color: "orange",
              fontSize: "x-large",
              textDecoration: "underline",
            }}
          >
            もう一度引く！
          </span>
        </>
      )}
    </Page>
  );
};

export default Omikuji;
