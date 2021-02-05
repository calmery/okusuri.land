import { VercelRequest, VercelResponse } from "@vercel/node";
import { gql } from "graphql-request";
import { Department } from "../../../types/Department";
import * as cache from "../../../utils/cache";
import * as cms from "../../../utils/cms";

// Helper Functions

const getDepartment = async (id: string) => {
  const { department } = await cms.request<{ department: Department }>(
    gql`
      {
        department(where: { id: "${id}" }) {
          description
          id
          icon { url }
          diseases {
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
          name
          url
        }
      }
    `
  );

  return department;
};

// CRUD

const get = async ({ query }: VercelRequest, response: VercelResponse) => {
  const id = encodeURIComponent(query.id as string);
  const data = JSON.parse(
    await cache.setnx(cache.key("departments", id), () => getDepartment(id))
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
      return response.status(404).end();
  }
};
