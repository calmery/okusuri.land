import { GetServerSideProps, NextPage } from "next";
import React, { useCallback, useMemo } from "react";
import { Page } from "~/components/Page";
import { useDispatch, useSelector } from "~/domains";
import { actions, selectors } from "~/domains/authentication";
import { useDepartments } from "~/hooks/useDepartments";
import { ResponseableDisease, ResponseablePatient } from "~/types/Responseable";
import { ApiResponse, get } from "~/utils/api";
import { Sentry } from "~/utils/sentry";

const Patients: NextPage<ResponseablePatient> = ({ diseases, record }) => {
  const { departments } = useDepartments();
  const dispatch = useDispatch();
  const myPatientRecord = useSelector(selectors.profile);
  const patientDiseases = useMemo<
    { [key in string]: ResponseableDisease[] }
  >(() => {
    if (!departments) {
      return {};
    }

    return departments.reduce((previous, department) => {
      const patientDiseaseIds = diseases
        .filter(({ departmentId }) => departmentId === department.id)
        .map(({ diseaseId }) => diseaseId);

      return {
        ...previous,
        [department.id]: department.diseases.filter((disease) =>
          patientDiseaseIds.includes(disease.id)
        ),
      };
    }, {});
  }, [departments, diseases]);

  const handleClickLogOutButton = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(actions.logOut());
  }, []);

  return (
    <Page title={`${record.name}さんのおくすり手帳`}>
      <span style={{ fontSize: "x-large" }}>
        <a
          href={`http://twitter.com/share?text=${encodeURI(
            record.name
          )}%E3%81%95%E3%82%93%E3%81%AE%E3%81%8A%E3%81%8F%E3%81%99%E3%82%8A%E6%89%8B%E5%B8%B3&url=${encodeURI(
            `${
              process.env.NODE_ENV === "production"
                ? "https://okusuri.land"
                : "http://localhost:8080"
            }/~${record.screenName}/index.htm`
          )}&related=metanen0x0&hashtags=%E3%81%8A%E3%81%8F%E3%81%99%E3%82%8A%E3%83%A9%E3%83%B3%E3%83%89`}
        >
          Twitterにシェアする
        </a>
      </span>
      <br />
      <br />

      {myPatientRecord && myPatientRecord.screenName === record.screenName && (
        <>
          <span style={{ color: "crimson", fontSize: "large" }}>
            <br />
            <strong>★マイページ★</strong>
            <br />
          </span>
          <a href="#" onClick={handleClickLogOutButton}>
            ログアウトする
          </a>
          <br />
        </>
      )}

      <br />
      <div>
        <img src="/line/rainbow.gif" width="100%" alt="イラスト1" />
      </div>
      <br />

      {departments && (
        <span style={{ color: "deepskyblue", fontSize: "medium" }}>
          <div>
            <strong>{record.name}さんのおくすり手帳です。</strong>
          </div>

          <br />
          <div>
            <img src="/line/note.gif" width="100%" alt="イラスト1" />
          </div>
          <br />

          {departments.map((department) => (
            <div key={department.id}>
              <a href={department.url} target="_blank">
                <strong>{department.name}</strong>
              </a>

              {!patientDiseases[department.id].length && (
                <div>
                  <br />
                  まだおくすりを貰っていません！
                </div>
              )}

              {patientDiseases[department.id].map((disease) => {
                return (
                  <div key={disease.id}>
                    <br />■{disease.name}■
                    <br />
                    {disease.description}
                    <br />
                    {disease.medicines.map((medicine) => (
                      <div key={medicine.name}>
                        <br />
                        <img
                          src={medicine.icon.url}
                          height="48px"
                          width="48px"
                        />
                        {medicine.name}
                        <br />
                        {medicine.description}
                      </div>
                    ))}
                  </div>
                );
              })}

              <br />
              <div>
                <img src="/line/note.gif" width="100%" alt="イラスト1" />
              </div>
              <br />
            </div>
          ))}
        </span>
      )}

      <img src="/line/rainbow.gif" width="100%" alt="イラスト1" />
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const { data } = await get<ApiResponse<ResponseablePatient>>(
      `/patients/${(query.screenName as string).slice(1)}`
    );
    return {
      props: data,
    };
  } catch (error) {
    Sentry.captureException(error);

    return {
      notFound: true,
    };
  }
};

export default Patients;
