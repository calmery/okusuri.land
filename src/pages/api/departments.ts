import { VercelRequest, VercelResponse } from "@vercel/node";
import { ResponseableDepartment } from "~/types/Responseable";
import { convertDepartmentToResponseableDepartment } from "~/utils/admin/api";
import { getDepartments } from "~/utils/admin/cms";

// CRUD

/** { data: ResponseableDepartment[] } */
const get = async (_: VercelRequest, response: VercelResponse) => {
  const departments = await getDepartments();

  if (!departments) {
    return response.status(503).end();
  }

  const data: ResponseableDepartment[] = departments.map(
    convertDepartmentToResponseableDepartment
  );

  response.send({ data });
};

// Serverless Functions

export default (request: VercelRequest, response: VercelResponse) => {
  switch (request.method) {
    case "GET":
      return get(request, response);

    default:
      return response.status(405).end();
  }
};
