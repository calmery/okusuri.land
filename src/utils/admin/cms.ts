import { gql, request as _request } from "graphql-request";
import { Sentry } from "../sentry";
import { key, setnx } from "./cache";
import { Department, DepartmentId } from "~/types/Department";
import { Disease, DiseaseId } from "~/types/Disease";
import { Prescription } from "~/types/Prescription";
import { Symptom } from "~/types/Symptom";
import * as json from "~/utils/json";

// Helper Functions

export const request = async <T extends unknown>(query: string): Promise<T> =>
  _request(process.env.GRAPHCMS_URL!, query);

// Main

export const getDiseasesByDepartmentId = async (departmentId: DepartmentId) => {
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
    Sentry.captureException(error);

    return null;
  }
};

export const createPrescription = async (diseaseIds: DiseaseId[]) => {
  try {
    const cache = await setnx(
      key("cms", "get_diseases_by_disease_ids", ...diseaseIds.sort()),
      () =>
        request(
          gql`
          {
            diseases(where: { id_in: [${diseaseIds
              .map((diseaseId) => `"${diseaseId}"`)
              .join(",")}] }) {
              description
              name
              medicines {
                description
                icon { url }
                name
              }
            }
          }
        `
        )
    );

    return json.parse<Prescription>(cache)!;
  } catch (error) {
    Sentry.captureException(error);

    return null;
  }
};

export const getDepartment = async (departmentId: DepartmentId) => {
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

    return json.parse<{ department: Department }>(cache)!.department;
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

    return json.parse<{ departments: Department[] }>(cache)!.departments;
  } catch (error) {
    Sentry.captureException(error);

    return null;
  }
};

export const getSymptomsByDepartmentId = async (departmentId: DepartmentId) => {
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
    Sentry.captureException(error);

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
    Sentry.captureException(error);

    return false;
  }
};
