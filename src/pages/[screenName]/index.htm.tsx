import { GetServerSideProps, NextPage } from "next";
import { PatientRecord } from "~/domains/authentication/models";
import { ApiResponse, get } from "~/utils/api";

const Patients: NextPage<{ patientRecord: PatientRecord }> = ({
  patientRecord,
}) => {
  return <div>{patientRecord.name}</div>;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { data } = await get<ApiResponse<PatientRecord>>(
    `/patients/${(query.screenName as string).slice(1)}`
  );

  return {
    props: {
      patientRecord: data,
    },
  };
};

export default Patients;
