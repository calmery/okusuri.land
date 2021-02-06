import { VercelRequest, VercelResponse } from "@vercel/node";
import { DepartmentId } from "~/types/Department";
import {
  getSymptomsByDepartmentId,
  isDepartmentExists,
} from "~/utils/admin/cms";

// CRUD

const get = async ({ query }: VercelRequest, response: VercelResponse) => {
  const departmentId = encodeURIComponent(query.id as string) as DepartmentId;

  if (!(await isDepartmentExists(departmentId))) {
    return response.status(404).end();
  }

  response.send({
    data: await getSymptomsByDepartmentId(departmentId),
  });
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
