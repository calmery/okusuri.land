import { GetServerSideProps, NextPage } from "next";
import { PatientRecord } from "~/domains/authentication/models";
import { ApiResponse, get } from "~/utils/api";
import { Sentry } from "~/utils/sentry";

const Patients: NextPage<{ patientRecord: PatientRecord }> = ({
  patientRecord,
}) => {
  return <div>{patientRecord.name}</div>;
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
