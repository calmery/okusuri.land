import { VercelRequest, VercelResponse } from "@vercel/node";
import * as cache from "~/utils/admin/cache";
import { getDepartments } from "~/utils/admin/cms";

// CRUD

const get = async (_: VercelRequest, response: VercelResponse) => {
  const data = JSON.parse(
    await cache.setnx(cache.key("departments"), getDepartments)
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
