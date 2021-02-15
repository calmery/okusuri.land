import { GetServerSideProps, NextPage } from "next";

const Noop: NextPage = () => null;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  res,
}) => {
  res.statusCode = 301;
  res.setHeader("Location", `/${query.screenName as string}/index.htm`);
  return { props: {} };
};

export default Noop;
