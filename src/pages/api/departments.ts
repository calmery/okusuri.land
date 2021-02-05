import { VercelRequest, VercelResponse } from "@vercel/node";
import { gql } from "graphql-request";
import { Department } from "~/types/Department";
import * as cache from "~/utils/cache";
import * as cms from "~/utils/cms";

// Helper Functions

const getDepartments = async () => {
  const { departments } = await cms.request<{
    departments: Department[];
  }>(
    gql`
      {
        departments {
          description
          id
          icon {
            url
          }
          diseases {
            description
            id
            medicines {
              description
              icon {
                url
              }
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
          name
          url
        }
      }
    `
  );

  return departments;
};

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
