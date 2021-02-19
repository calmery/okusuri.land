import { VercelRequest, VercelResponse } from "@vercel/node";
import Twitter from "twitter";
import { PatientInsuranceCard } from "~/types/PatientInsuranceCard";
import { ResponseablePatient } from "~/types/Responseable";
import { createResponseablePatient } from "~/utils/admin/api";
import { verify } from "~/utils/admin/authentication";
import { cors } from "~/utils/admin/cors";
import {
  getPatientDiseases,
  getPatientRecordByPatientId,
  transaction,
  upsertPatient,
  upsertPatientRecord,
} from "~/utils/admin/database";

const getPatientRecordFromTwitter = ({
  accessToken,
  accessTokenSecret,
}: PatientInsuranceCard): Promise<{
  id: string;
  image: string;
  name: string;
  screenName: string;
}> =>
  new Promise((resolve, reject) => {
    const twitter = new Twitter({
      consumer_key: process.env.TWITTER_API_KEY!,
      consumer_secret: process.env.TWITTER_API_KEY_SECRET!,
      access_token_key: accessToken,
      access_token_secret: accessTokenSecret,
    });

    twitter.get("account/verify_credentials", (error: Error, data) => {
      if (error) {
        return reject(error);
      }

      resolve({
        id: `${data.id}`,
        image: data.profile_image_url_https,
        name: data.name,
        screenName: data.screen_name,
      });
    });
  });

// CRUD

/** { data: ResponseablePatient } */
const get = async (request: VercelRequest, response: VercelResponse) => {
  const patientId = await verify(request);

  if (!patientId) {
    return response.status(400).end();
  }

  const patientRecord = await getPatientRecordByPatientId(patientId);

  if (!patientRecord) {
    return response.status(404).end();
  }

  const data: ResponseablePatient = createResponseablePatient(
    await getPatientDiseases(patientId),
    patientRecord
  );

  response.send({ data });
};

/** { data: ResponseablePatient } */
const post = async (request: VercelRequest, response: VercelResponse) => {
  const patientId = await verify(request);
  const patientInsuranceCard = request.body as PatientInsuranceCard;

  if (
    !patientId ||
    !patientInsuranceCard ||
    !patientInsuranceCard.accessToken ||
    !patientInsuranceCard.accessTokenSecret
  ) {
    return response.status(400).end();
  }

  if (
    !(await transaction([
      upsertPatient(patientId, patientInsuranceCard),
      upsertPatientRecord(
        patientId,
        await getPatientRecordFromTwitter(patientInsuranceCard)
      ),
    ]))
  ) {
    return response.status(503).end();
  }

  const patientRecord = await getPatientRecordByPatientId(patientId);

  if (!patientRecord) {
    return response.status(503).end();
  }

  const data: ResponseablePatient = createResponseablePatient(
    await getPatientDiseases(patientId),
    patientRecord
  );

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
