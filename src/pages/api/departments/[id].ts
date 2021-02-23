import { VercelRequest, VercelResponse } from "@vercel/node";
import { GraphCmsDepartmentId, GraphCmsDiseaseId } from "~/types/GraphCMS";
import {
  ResponseableDepartment,
  ResponseablePrescription,
} from "~/types/Responseable";
import { convertDepartmentToResponseableDepartment } from "~/utils/admin/api";
import { verify } from "~/utils/admin/authentication";
import {
  getDepartment,
  getDiseasesByDepartmentId,
  getSymptomsByDepartmentId,
  isDepartmentExists,
} from "~/utils/admin/cms";
import { cors } from "~/utils/admin/cors";
import {
  createPatientDisease,
  getPatientDiseases,
  getPatientPhysicalCondition,
  isPatientExists,
  transaction,
  upsertPatientPhysicalCondition,
} from "~/utils/admin/database";

/** { data: ResponseableDepartment } */
const get = async (request: VercelRequest, response: VercelResponse) => {
  const departmentId = encodeURIComponent(
    request.query.id as string
  ) as GraphCmsDepartmentId;

  if (!(await isDepartmentExists(departmentId))) {
    return response.status(404).end();
  }

  const department = await getDepartment(departmentId);

  if (!department) {
    return response.status(503).end();
  }

  const data: ResponseableDepartment = convertDepartmentToResponseableDepartment(
    department
  );

  response.send({ data });
};

/** { data: { prescription: ResponseablePrescription } */
const post = async (request: VercelRequest, response: VercelResponse) => {
  /* Firebase で Token を検証、Patient の ID を取得する */

  const patientId = await verify(request);

  if (!patientId || !(await isPatientExists(patientId))) {
    return response.status(403).end();
  }

  /* GraphCMS に指定された Department が存在するか、ユーザからのリクエストが正しいかを確認する */

  const { force = false, symptoms: currentSymptoms } = request.body as Partial<{
    force?: boolean;
    symptoms: { [key: string]: number };
  }>;
  const departmentId = request.query.id as GraphCmsDepartmentId;

  if (!currentSymptoms || !(await isDepartmentExists(departmentId))) {
    return response.status(400).end();
  }

  /* これからの処理に必要となる値を取得、この時点で `departmentId` と `patientId` は正しい値、処理に失敗する場合は何かしら問題が起こっている */

  const diseases = await getDiseasesByDepartmentId(departmentId);
  const physicalCondition = ((
    await getPatientPhysicalCondition(departmentId, patientId)
  )?.json || {}) as Record<string, number>;
  const symptoms = await getSymptomsByDepartmentId(departmentId);

  if (!diseases || !symptoms) {
    return response.status(503).end();
  }

  /* Department に存在する Symptoms を元に PhysicalCondition の値を更新する */

  const updatedKeys: string[] = [];

  symptoms.forEach((symptom) => {
    if (updatedKeys.includes(symptom.key)) {
      return;
    }

    let value = physicalCondition[symptom.key] || symptom.defaultValue;

    if (
      !isNaN(currentSymptoms[symptom.key]) &&
      (force || Math.abs(currentSymptoms[symptom.key]) <= symptom.maximumChange)
    ) {
      value += currentSymptoms[symptom.key];
      updatedKeys.push(symptom.key);
    }

    physicalCondition[symptom.key] = value;
  });

  /* 更新した PhysicalCondition の値をデータベースに反映する */

  // ToDo: 下の `transaction` 関数に混ぜたい
  await upsertPatientPhysicalCondition(
    departmentId,
    patientId,
    physicalCondition
  );

  /* 更新した PhysicalCondition の値を元に Disease の判定を行う */

  const onsetDiseaseIds: GraphCmsDiseaseId[] = [];
  const patientDiseaseIds = (
    (await getPatientDiseases(patientId, departmentId)) || []
  ).map(({ diseaseId }) => diseaseId);

  diseases.forEach((disease) => {
    // 既に発症している
    if (patientDiseaseIds.includes(disease.id)) {
      return;
    }

    const { symptoms } = disease;

    if (
      // 全ての症状に当てはまる場合、発症している
      symptoms.every(
        (symptom) => symptom.threshold <= physicalCondition[symptom.key]
      )
    ) {
      onsetDiseaseIds.push(disease.id);
    }
  });

  /* データベースに発症した Disease を反映する */

  if (
    !(await transaction(
      onsetDiseaseIds.map((onsetDiseaseId) =>
        createPatientDisease(departmentId, patientId, onsetDiseaseId)
      )
    ))
  ) {
    return response.status(503).end();
  }

  /* */

  const data: ResponseablePrescription = {
    prescription: {
      diseaseIds: onsetDiseaseIds,
    },
  };

  response.send({ data });
};

// Serverless Functions

export default async (request: VercelRequest, response: VercelResponse) => {
  await cors(request, response);

  switch (request.method) {
    case "GET":
      return get(request, response);

    case "POST":
      return post(request, response);

    default:
      return response.status(405).end();
  }
};
