import { GetServerSideProps, NextPage } from "next";
import React, { useCallback } from "react";
import { Page } from "~/components/Page";
import { useSelector } from "~/domains";
import { selectors } from "~/domains/authentication";
import { PatientRecord } from "~/domains/authentication/models";
import { ApiResponse, get } from "~/utils/api";
import * as GA from "~/utils/google-analytics";
import { Sentry } from "~/utils/sentry";

const Patients: NextPage<{ patientRecord: PatientRecord }> = ({
  patientRecord,
}) => {
  const myPatientRecord = useSelector(selectors.profile);

  const handleClickTwitterShareButton = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      GA.shareMyPage(patientRecord.screenName);
      location.href =
        "http://twitter.com/share?url=${window.location.href}&related=metanen0x0&hashtags=%E3%81%8A%E3%81%8F%E3%81%99%E3%82%8A%E3%83%A9%E3%83%B3%E3%83%89";
    },
    [patientRecord.screenName]
  );

  return (
    <Page title={`${patientRecord.name}さんのおくすり手帳`}>
      {myPatientRecord && myPatientRecord.id === patientRecord.id && (
        <>
          <span style={{ color: "crimson", fontSize: "large" }}>
            <br />
            <strong>★マイページ★</strong>
            <br />
          </span>
          <span style={{ fontSize: "x-large" }}>
            <a href="#" onClick={handleClickTwitterShareButton}>
              Twitterにシェアする
            </a>
          </span>
          <br />
        </>
      )}

      <img src="/line/rainbow.gif" width="100%" alt="イラスト1" />

      <span style={{ color: "deepskyblue", fontSize: "medium" }}>
        <strong>{patientRecord.name}さんのおくすり手帳です。</strong>
        <br />
        <br />
        <img src="/line/note.gif" width="100%" alt="イラスト1" />
        <br />
        <strong>めたねのあーと病院</strong>
        <br />
        <br />
        ■ノネメ欠乏症■
        <br />
        お薬の画像
        <br />
        <img src="/line/note.gif" width="100%" alt="イラスト1" />
        <br />
        <br />
        <img src="/line/rainbow.gif" width="100%" alt="イラスト1" />
      </span>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const { data } = await get<ApiResponse<PatientRecord>>(
      `/patients/${(query.screenName as string).slice(1)}`
    );
    return {
      props: {
        patientRecord: data,
      },
    };
  } catch (error) {
    Sentry.captureException(error);

    return {
      notFound: true,
    };
  }
};

export default Patients;
