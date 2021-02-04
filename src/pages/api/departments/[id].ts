import { VercelRequest, VercelResponse } from "@vercel/node";
import { gql } from "graphql-request";
import * as cache from "../../../utils/cache";
import * as cms from "../../../utils/cms";

// Helper Functions

const getDepartment = async <T extends unknown>(id: string): Promise<T> =>
  cms.request(
    gql`
      {
        department(where: { id: "${id}" }) {
          description
          id
          icon { url }
          medicines {
            description
            icon { url }
            id
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

// CRUD

const get = async ({ query }: VercelRequest, response: VercelResponse) => {
  const id = encodeURIComponent(query.id as string);
  const data = JSON.parse(
    await cache.setnx(cache.key("department", id), () => getDepartment(id))
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
