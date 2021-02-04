import { VercelRequest, VercelResponse } from "@vercel/node";
import { request, gql } from "graphql-request";

// CRUD

const get = async (_: VercelRequest, response: VercelResponse) => {
  const data = await request(
    process.env.GRAPHCMS_URL!,
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
