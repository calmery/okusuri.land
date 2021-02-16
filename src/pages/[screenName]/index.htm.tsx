import { GetServerSideProps, NextPage } from "next";
import React, { useCallback, useMemo } from "react";
import { Page } from "~/components/Page";
import { useDispatch, useSelector } from "~/domains";
import { actions, selectors } from "~/domains/authentication";
import { useDepartments } from "~/hooks/useDepartments";
import { Disease } from "~/types/Disease";
import { Patient } from "~/types/Patient";
import { ApiResponse, get } from "~/utils/api";
import { Sentry } from "~/utils/sentry";

const Patients: NextPage<Patient> = ({ diseases, record }) => {
  const { departments } = useDepartments();
  const dispatch = useDispatch();
  const myPatientRecord = useSelector(selectors.profile);
  const patientDiseases = useMemo<{ [key in string]: Disease[] }>(() => {
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
      {myPatientRecord && myPatientRecord.id === record.id && (
        <>
          <span style={{ color: "crimson", fontSize: "large" }}>
            <br />
            <strong>★マイページ★</strong>
            <br />
          </span>
          <span style={{ fontSize: "x-large" }}>
            <a
              href={`http://twitter.com/share?url=${window.location.href}&related=metanen0x0&hashtags=%E3%81%8A%E3%81%8F%E3%81%99%E3%82%8A%E3%83%A9%E3%83%B3%E3%83%89`}
            >
              Twitterにシェアする
            </a>
          </span>
          <br />
          <br />
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
                      <div key={medicine.id}>
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
    const { data } = await get<ApiResponse<Patient>>(
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
