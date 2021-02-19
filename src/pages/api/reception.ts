import { VercelRequest, VercelResponse } from "@vercel/node";
import Twitter from "twitter";
import {
  PatientInsuranceCard,
  PatientRecord,
} from "~/domains/authentication/models";
import { verify } from "~/utils/admin/authentication";
import { cors } from "~/utils/admin/cors";
import {
  getPatientRecordByPatientId,
  transaction,
  upsertPatient,
  upsertPatientRecord,
} from "~/utils/admin/database";

const getPatientRecordFromTwitter = ({
  accessToken,
  accessTokenSecret,
}: PatientInsuranceCard): Promise<PatientRecord> =>
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

  const data: PatientRecord = {
    id: patientRecord.id,
    image: patientRecord.image,
    name: patientRecord.name,
    screenName: patientRecord.screenName,
  };

  response.send({
    data,
  });
};

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

  const patientRecord = await getPatientRecordFromTwitter(patientInsuranceCard);

  await transaction([
    upsertPatient(patientId, patientInsuranceCard),
    upsertPatientRecord(patientId, patientRecord),
  ]);

  const data: PatientRecord = {
    id: patientRecord.id,
    image: patientRecord.image,
    name: patientRecord.name,
    screenName: patientRecord.screenName,
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
