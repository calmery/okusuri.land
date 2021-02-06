import { VercelRequest, VercelResponse } from "@vercel/node";
import { getPatientRecordByScreenName } from "~/utils/admin/database";

// CRUD

const get = async ({ query }: VercelRequest, response: VercelResponse) => {
  const patientRecord = await getPatientRecordByScreenName(
    query.screenName as string
  );

  if (!patientRecord) {
    return response.status(404).end();
  }

  response.send({
    data: {
      id: patientRecord.id,
      image: patientRecord.image,
      name: patientRecord.name,
      screenName: patientRecord.screenName,
    },
  });
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
