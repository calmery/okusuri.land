import { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";

const Error: NextPage = () => {
  const [hostname, setHostname] = useState("");
  const [port, setPort] = useState("80");

  useEffect(() => {
    setHostname(location.hostname);
    setPort(location.port);
  }, []);

  return (
    <>
      <Head>
        <title>500 Internal Server Error</title>
      </Head>

      <div
        style={{ margin: "8px", fontFamily: "'Times New Roman', sans-serif" }}
      >
        <h1>Internal Server Error</h1>
        <p>
          The server encountered an internal error of misconfiguration and was
          unable to complete your request.
        </p>
        <p>
          Please contact the server administrator, @metanen0x0 and inform them
          of the time the error occurred, and anything you might have done that
          may have caused the error.
        </p>
        <p>
          More information about this error may be available in the server error
          log.
        </p>
        <hr />
        <address>
          {hostname} Port {port}
        </address>
      </div>
    </>
  );
};

export default Error;
