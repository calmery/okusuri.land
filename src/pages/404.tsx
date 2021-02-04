import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import React, { useEffect, useState } from "react";

const Error: NextPage = () => {
  const { asPath } = useRouter();
  const [hostname, setHostname] = useState("");
  const [path, setPath] = useState("");
  const [port, setPort] = useState("80");

  useEffect(() => {
    setHostname(location.hostname);
    setPath(asPath);
    setPort(location.port);
  }, [asPath]);

  return (
    <>
      <Head>
        <title>404 Not Found</title>
      </Head>

      <div
        style={{ margin: "8px", fontFamily: "'Times New Roman', sans-serif" }}
      >
        <h1>Not Found</h1>
        <p>The requested URL {path} was not found on this server.</p>
        <hr />
        <address>
          {hostname} Port {port}
        </address>
      </div>
    </>
  );
};

export default Error;
