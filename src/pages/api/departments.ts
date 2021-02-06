import { VercelRequest, VercelResponse } from "@vercel/node";
import { getDepartments } from "~/utils/admin/cms";

// CRUD

const get = async (_: VercelRequest, response: VercelResponse) =>
  response.send({ data: await getDepartments() });

// Serverless Functions

export default (request: VercelRequest, response: VercelResponse) => {
  switch (request.method) {
    case "GET":
      return get(request, response);

    default:
      return response.status(405).end();
  }
};
