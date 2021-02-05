import { VercelRequest, VercelResponse } from "@vercel/node";
import * as cache from "~/utils/admin/cache";
import { getMedicinesByDepartmentId } from "~/utils/admin/cms";

// CRUD

const get = async ({ query }: VercelRequest, response: VercelResponse) => {
  const departmentId = encodeURIComponent(query.id as string);
  const data = JSON.parse(
    await cache.setnx(cache.key("departments", departmentId, "medicines"), () =>
      getMedicinesByDepartmentId(departmentId)
    )
  );

  response.send({
    data,
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
