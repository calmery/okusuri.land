import { NextPage } from "next";
import { useDepartments } from "../hooks/useDepartments";

const Departments: NextPage = () => {
  const { departments, error } = useDepartments();

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!departments) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      {departments.map((department) => (
        <div key={department.id}>
          <div>{department.name}</div>
        </div>
      ))}
    </>
  );
};

export default Departments;
