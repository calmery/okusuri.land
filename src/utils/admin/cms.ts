import { gql, request as _request } from "graphql-request";
import { key, setnx } from "./cache";
import { Department, DepartmentId } from "~/types/Department";
import { Disease } from "~/types/Disease";
import { Medicine } from "~/types/Medicine";
import { Symptom } from "~/types/Symptom";
import * as json from "~/utils/json";

// Helper Functions

export const request = async <T extends unknown>(query: string): Promise<T> =>
  _request(process.env.GRAPHCMS_URL!, query);

// Main

export const getDiseasesByDepartmentId = async (departmentId: string) => {
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
      diseases: Disease[];
    }>(cache)!.diseases;
  } catch (error) {
    // ToDo: Sentry にエラーを送信する

    return null;
  }
};

export const getDepartment = async (id: string) => {
  const { department } = await request<{ department: Department }>(
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
  );

  return department;
};

export const getDepartments = async () => {
  const { departments } = await request<{
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
  );

  return departments;
};

export const getMedicinesByDepartmentId = async (id: string) => {
  const { medicines } = await request<{
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

export const getSymptomsByDepartmentId = async (departmentId: string) => {
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

    return json.parse<{ symptoms: Symptom[] }>(cache)!.symptoms;
  } catch (error) {
    // ToDo: Sentry にエラーを送信する

    return null;
  }
};

export const isDepartmentExists = async (departmentId: DepartmentId) => {
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

    return !!json.parse<{ department: Department | null }>(cache)!.department;
  } catch (error) {
    // ToDo: Sentry にエラーを送信する

    return false;
  }
};
