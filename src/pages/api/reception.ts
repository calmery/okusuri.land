import { VercelRequest, VercelResponse } from "@vercel/node";
import { verify } from "~/utils/admin/authentication";
import { cors } from "~/utils/admin/cors";
import { getPatientRecordByPatientId } from "~/utils/admin/database";

// CRUD

const get = async (request: VercelRequest, response: VercelResponse) => {
  const patientId = await verify(request);

  if (!patientId) {
    return response.send({
      data: null,
    });
  }

  const patientRecord = await getPatientRecordByPatientId(patientId);

  if (!patientRecord) {
    return response.send({
      data: null,
    });
  }

  response.send({
    data: {
      image: patientRecord.image,
      name: patientRecord.name,
      screenName: patientRecord.screenName,
    },
  });
};

// Serverless Functions

export default async (request: VercelRequest, response: VercelResponse) => {
  await cors(request, response);

  switch (request.method) {
    case "GET":
      return get(request, response);

    default:
      return response.status(405).end();
  }
};
