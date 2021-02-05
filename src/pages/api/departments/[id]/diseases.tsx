import { VercelRequest, VercelResponse } from "@vercel/node";
import { gql } from "graphql-request";
import { Disease } from "../../../../types/Disease";
import * as cache from "../../../../utils/cache";
import * as cms from "../../../../utils/cms";

// Helper Functions

const getDiseasesByDepartmentId = async (id: string) => {
  const { diseases } = await cms.request<{
    diseases: Disease[];
  }>(
    gql`
      {
        diseases(where: {
          department: {
            id: "${id}"
          }
        }) {
          description
          id
          medicines {
            description
            icon { url }
            id
            name
          }
          name
          symptoms {
            description
              id
            key
            value
          }
        }
      }
    `
  );

  return diseases;
};

// CRUD

const get = async ({ query }: VercelRequest, response: VercelResponse) => {
  const departmentId = encodeURIComponent(query.id as string);
  const data = JSON.parse(
    await cache.setnx(cache.key("departments", departmentId, "diseases"), () =>
      getDiseasesByDepartmentId(departmentId)
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
