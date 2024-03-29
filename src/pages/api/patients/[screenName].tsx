import { VercelRequest, VercelResponse } from "@vercel/node";
import { ResponseablePatient } from "~/types/Responseable";
import { createResponseablePatient } from "~/utils/admin/api";
import {
  getPatientDiseases,
  getPatientRecordByScreenName,
} from "~/utils/admin/database";

// CRUD

/** { data: ResponseablePatient } */
const get = async ({ query }: VercelRequest, response: VercelResponse) => {
  const patientRecord = await getPatientRecordByScreenName(
    query.screenName as string
  );

  if (!patientRecord) {
    return response.status(404).end();
  }

  const data: ResponseablePatient = createResponseablePatient(
    await getPatientDiseases(patientRecord.patientId),
    patientRecord
  );

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
