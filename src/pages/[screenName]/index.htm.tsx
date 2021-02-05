import { GetServerSideProps, NextPage } from "next";
import { PatientRecord } from "../../domains/authentication/models";
import { ApiResponse, get } from "../../utils/api";

const Patients: NextPage<{ patientRecord: PatientRecord }> = ({
  patientRecord,
}) => {
  return <div>{patientRecord.name}</div>;
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  res,
}) => {
  const screenName = query.screenName as string;

  if (!screenName.startsWith("~")) {
    res.setHeader("Location", `/~${screenName}/index.htm`);
    res.statusCode = 301;
    res.end();
  }

  const { data } = await get<ApiResponse<PatientRecord>>(
    `/patients/${screenName.slice(1)}`
  );

  return {
    props: {
      patientRecord: data,
    },
  };
};

export default Patients;
