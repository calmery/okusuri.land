import { VercelRequest, VercelResponse } from "@vercel/node";
import { gql } from "graphql-request";
import { Symptom } from "../../../../types/Symptom";
import * as cache from "../../../../utils/cache";
import * as cms from "../../../../utils/cms";

// Helper Functions

const getSymptomsByDepartmentId = async (departmentId: string) => {
  const { symptoms } = await cms.request<{
    symptoms: Symptom[];
  }>(
    gql`
      {
        symptoms(where: {
          diseases_every: {
            department: {
              id: "${departmentId}"
            }
          }
        }) {
          description
          id
          key
          value
        }
      }
    `
  );

  return symptoms;
};

// CRUD

const get = async ({ query }: VercelRequest, response: VercelResponse) => {
  const departmentId = encodeURIComponent(query.id as string);
  const data = JSON.parse(
    await cache.setnx(cache.key("departments", departmentId, "symptoms"), () =>
      getSymptomsByDepartmentId(departmentId)
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
