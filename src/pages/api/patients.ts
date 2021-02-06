import { VercelRequest, VercelResponse } from "@vercel/node";
import Twitter from "twitter";
import {
  PatientInsuranceCard,
  PatientRecord,
} from "~/domains/authentication/models";
import { verify } from "~/utils/admin/authentication";
import {
  transaction,
  upsertPatient,
  upsertPatientRecord,
} from "~/utils/admin/database";

// Helper Functions

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

const post = async (request: VercelRequest, response: VercelResponse) => {
  const patientId = await verify(request);
  const patientInsuranceCard = request.body as PatientInsuranceCard;

  if (
    !patientId ||
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

  response.send({ data: patientRecord });
};

// Serverless Functions

export default (request: VercelRequest, response: VercelResponse) => {
  switch (request.method) {
    case "POST":
      return post(request, response);

    default:
      return response.status(405).end();
  }
};
