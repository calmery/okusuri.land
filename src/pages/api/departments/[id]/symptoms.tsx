import { VercelRequest, VercelResponse } from "@vercel/node";
import { getSymptomsByDepartmentId } from "~/utils/admin/cms";

// CRUD

const get = async ({ query }: VercelRequest, response: VercelResponse) =>
  response.send({
    data: await getSymptomsByDepartmentId(
      encodeURIComponent(query.id as string)
    ),
  });

// Serverless Functions

export default (request: VercelRequest, response: VercelResponse) => {
  switch (request.method) {
    case "GET":
      return get(request, response);

    default:
      return response.status(405).end();
  }
};
