import { VercelRequest, VercelResponse } from "@vercel/node";
import { DepartmentId } from "~/types/Department";
import { verify } from "~/utils/admin/authentication";
import * as cache from "~/utils/admin/cache";
import {
  getDepartment,
  getSymptomKeysByDepartmentId,
  isDepartmentExists,
} from "~/utils/admin/cms";
import {
  getPatientPhysicalCondition,
  isPatientExists,
  upsertPatientPhysicalCondition,
} from "~/utils/admin/database";
import * as json from "~/utils/json";

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

const post = async (request: VercelRequest, response: VercelResponse) => {
  const patientId = await verify(request);

  if (!patientId || !(await isPatientExists(patientId))) {
    return response.status(403).end();
  }

  const departmentId = request.query.id as DepartmentId;

  if (!isDepartmentExists(departmentId)) {
    return response.status(404).end();
  }

  const body = json.parse<Partial<{ symptoms: { [key: string]: number } }>>(
    request.body
  );

  if (!body || !body.symptoms) {
    return response.status(400).end();
  }

  const symptomKeys = await getSymptomKeysByDepartmentId(departmentId);

  if (!symptomKeys) {
    return response.status(503).end();
  }

  const { symptoms } = body;
  const physicalCondition = await getPatientPhysicalCondition(
    departmentId,
    patientId
  );
  const nextPhysicalCondition: Record<string, number> = {};

  symptomKeys.forEach((symptomKey) => {
    // ToDo: defaultValue を設定できるようにする
    let value = physicalCondition[symptomKey] || 0;

    // ToDo: 異常な値を検出できるようにする
    if (isNaN(value)) {
      value = 0;
    }

    if (!isNaN(symptoms[symptomKey])) {
      value += symptoms[symptomKey];
    }

    nextPhysicalCondition[symptomKey] = value;
  });

  await upsertPatientPhysicalCondition(
    departmentId,
    patientId,
    nextPhysicalCondition
  );

  // ToDo: 判定を行う

  response.send("OK");
};

// Serverless Functions

export default (request: VercelRequest, response: VercelResponse) => {
  switch (request.method) {
    case "GET":
      return get(request, response);

    case "POST":
      return post(request, response);

    default:
      return response.status(405).end();
  }
};
