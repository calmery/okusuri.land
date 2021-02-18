import { VercelRequest, VercelResponse } from "@vercel/node";
import { DepartmentId } from "~/types/Department";
import { Patient } from "~/types/Patient";
import {
  getPatientDiseases,
  getPatientRecordByScreenName,
} from "~/utils/admin/database";

// CRUD

const get = async ({ query }: VercelRequest, response: VercelResponse) => {
  const patientRecord = await getPatientRecordByScreenName(
    query.screenName as string
  );

  if (!patientRecord) {
    return response.status(404).end();
  }

  const patientDiseases = await getPatientDiseases(patientRecord.patientId);

  const data: Patient = {
    diseases: patientDiseases.map((patientDisease) => ({
      createdAt: patientDisease.createdAt.toString(),
      departmentId: patientDisease.departmentId as DepartmentId,
      diseaseId: patientDisease.diseaseId,
    })),
    record: {
      id: patientRecord.id,
      image: patientRecord.image,
      name: patientRecord.name,
      screenName: patientRecord.screenName,
    },
  };

  response.send({ data });
};

// Main

export default (request: VercelRequest, response: VercelResponse) => {
  switch (request.method) {
    case "GET":
      return get(request, response);

    default:
      return response.status(405).end();
  }
};
