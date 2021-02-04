import { VercelRequest, VercelResponse } from "@vercel/node";
import { gql } from "graphql-request";
import * as cache from "../../utils/cache";
import * as cms from "../../utils/cms";

// Helper Functions

const getDepartments = () =>
  cms.request(
    gql`
      {
        departments {
          description
          id
          icon {
            url
          }
          medicines {
            description
            icon {
              url
            }
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
      return response.status(404).end();
  }
};
