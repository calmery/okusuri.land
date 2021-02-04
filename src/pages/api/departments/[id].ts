import { VercelRequest, VercelResponse } from "@vercel/node";
import { request, gql } from "graphql-request";

// CRUD

const get = async ({ query }: VercelRequest, response: VercelResponse) => {
  const id = encodeURIComponent(query.id as string);
  const data = await request(
    process.env.GRAPHCMS_URL!,
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
