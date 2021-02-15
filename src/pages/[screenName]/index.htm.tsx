import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { Page } from "~/components/Page";
import { useSelector } from "~/domains";
import { selectors } from "~/domains/authentication";
import { PatientRecord } from "~/domains/authentication/models";
import { ApiResponse, get } from "~/utils/api";
import { Sentry } from "~/utils/sentry";

const Patients: NextPage<{ patientRecord: PatientRecord }> = ({
  patientRecord,
}) => {
  const myPatientRecord = useSelector(selectors.profile);

  return (
    <Page title={`${patientRecord.name}さんのおくすり手帳`}>
      {myPatientRecord && myPatientRecord.id === patientRecord.id && (
        <span style={{ color: "crimson", fontSize: "large" }}>
          <br />
          <strong>★マイページ★</strong>
          <br />
        </span>
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
