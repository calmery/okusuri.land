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

export const getDiseasesByDepartmentId = async (id: string) => {
  const { diseases } = await request<{
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

export const getSymptomKeysByDepartmentId = async (
  departmentId: DepartmentId
) => {
  try {
    const cache = await setnx(
      key("cms", "get_symptom_keys_by_department_id", departmentId),
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
                key
              }
            }
          `
        )
    );

    if (!cache) {
      return null;
    }

    const { symptoms } = json.parse<{
      symptoms: Pick<Symptom, "key">[];
    }>(cache)!;

    return symptoms.map(({ key }) => key);
  } catch (error) {
    // ToDo: Sentry にエラーを送信する

    return null;
  }
};

export const getSymptomsByDepartmentId = async (departmentId: string) => {
  const { symptoms } = await request<{
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

    if (!cache) {
      return false;
    }

    return !!json.parse<{ department: Department | null }>(cache)!.department;
  } catch (error) {
    // ToDo: Sentry にエラーを送信する

    return false;
  }
};
