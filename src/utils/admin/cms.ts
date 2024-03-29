import { gql, request as _request } from "graphql-request";
import { Sentry } from "../sentry";
import { key, setnx } from "./cache";
import {
  GraphCmsDepartment,
  GraphCmsDepartmentId,
  GraphCmsDisease,
  GraphCmsSymptom,
} from "~/types/GraphCMS";
import * as json from "~/utils/json";

// Helper Functions

export const request = async <T extends unknown>(query: string): Promise<T> =>
  _request(process.env.GRAPHCMS_URL!, query);

// Main

export const getDiseasesByDepartmentId = async (
  departmentId: GraphCmsDepartmentId
) => {
  try {
    const cache = await setnx(
      key("cms", "get_diseases_by_department_id", departmentId),
      () =>
        request(
          gql`
            {
              diseases(where: {
                department: {
                  id: "${departmentId}"
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
                  maximumChange
                  key
                  threshold
                }
              }
            }
          `
        )
    );

    return json.parse<{
      diseases: GraphCmsDisease[];
    }>(cache)!.diseases;
  } catch (error) {
    Sentry.captureException(error);

    return null;
  }
};

export const getDepartment = async (departmentId: GraphCmsDepartmentId) => {
  try {
    const cache = await setnx(key("cms", "get_department", departmentId), () =>
      request(
        gql`
            {
              department(where: { id: "${departmentId}" }) {
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
                    maximumChange
                    key
                    threshold
                  }
                }
                name
                url
              }
            }
          `
      )
    );

    return json.parse<{ department: GraphCmsDepartment }>(cache)!.department;
  } catch (error) {
    Sentry.captureException(error);

    return null;
  }
};

export const getDepartments = async () => {
  try {
    const cache = await setnx(key("cms", "get_departments"), () =>
      request(
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
                  maximumChange
                  key
                  threshold
                }
              }
              name
              url
            }
          }
        `
      )
    );

    return json.parse<{ departments: GraphCmsDepartment[] }>(cache)!
      .departments;
  } catch (error) {
    Sentry.captureException(error);

    return null;
  }
};

export const getSymptomsByDepartmentId = async (
  departmentId: GraphCmsDepartmentId
) => {
  try {
    const cache = await setnx(
      key("cms", "get_symptoms_by_department_id", departmentId),
      () =>
        request(
          gql`
            {
              symptoms(where: {
                diseases_every: {
                  department: {
                    id: "${departmentId}"
                  }
                }
              }) {
                defaultValue
                description
                id
                key
                maximumChange
                threshold
              }
            }
          `
        )
    );

    return json.parse<{ symptoms: GraphCmsSymptom[] }>(cache)!.symptoms;
  } catch (error) {
    Sentry.captureException(error);

    return null;
  }
};

export const isDepartmentExists = async (
  departmentId: GraphCmsDepartmentId
) => {
  try {
    const cache = await setnx(
      key("cms", "is_department_exists", departmentId),
      () =>
        request(
          gql`
          {
            department(where: {
              id: "${departmentId}"
            }) {
              id
            }
          }
        `
        )
    );

    return !!json.parse<{ department: GraphCmsDepartment | null }>(cache)!
      .department;
  } catch (error) {
    Sentry.captureException(error);

    return false;
  }
};
