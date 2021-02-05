import { VercelRequest, VercelResponse } from "@vercel/node";
import { gql } from "graphql-request";
import { Medicine } from "../../../../types/Medicine";
import * as cache from "../../../../utils/cache";
import * as cms from "../../../../utils/cms";

// Helper Functions

const getDepartmentMedicines = async (id: string) => {
  const { medicines } = await cms.request<{
    medicines: Medicine[];
  }>(
    gql`
      {
        medicines(where: {
          disease: {
            department: {
              id: "${id}"
            }
          }
        }) {
          description
          icon { url }
          id
          name
        }
      }
    `
  );

  return medicines;
};

// CRUD

const get = async ({ query }: VercelRequest, response: VercelResponse) => {
  const id = encodeURIComponent(query.id as string);
  const data = JSON.parse(
    await cache.setnx(cache.key("department", "medicines", id), () =>
      getDepartmentMedicines(id)
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
