import { GetServerSideProps } from "next";

export { default } from "./index.htm";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.statusCode = 301;
  res.setHeader("Location", `/index.htm`);
  return { props: {} };
};
