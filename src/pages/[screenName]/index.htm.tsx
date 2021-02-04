import { GetServerSideProps, NextPage } from "next";
import { UserProfile } from "../../domains/authentication/models";
import { ApiResponse, get } from "../../utils/api";

const Patients: NextPage<{ userProfile: UserProfile }> = ({ userProfile }) => {
  return <div>{userProfile.name}</div>;
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

  const { data } = await get<ApiResponse<UserProfile>>(
    `/patients/${screenName.slice(1)}`
  );

  return {
    props: {
      userProfile: data,
    },
  };
};

export default Patients;
