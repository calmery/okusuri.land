import { GetServerSideProps, NextPage } from "next";

const Noop: NextPage = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.statusCode = 301;
  res.setHeader("Location", `/index.htm`);
  return { props: {} };
};

export default Noop;
