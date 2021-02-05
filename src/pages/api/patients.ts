import { IncomingHttpHeaders } from "http";
import { PrismaClient } from "@prisma/client";
import { VercelRequest, VercelResponse } from "@vercel/node";
import * as admin from "firebase-admin";
import Twitter from "twitter";
import {
  PatientInsuranceCard,
  PatientRecord,
} from "../../domains/authentication/models";

// Firebase Admin

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

// Helper Functions

const getPatientRecordFromTwitter = ({
  accessToken,
  accessTokenSecret,
}: PatientInsuranceCard): Promise<Omit<PatientRecord, "diseases">> =>
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

const getPatientId = async ({
  authorization,
}: IncomingHttpHeaders): Promise<string | null> => {
  if (!authorization) {
    return null;
  }

  const matched = authorization.match(/^Token\s+(.+)$/);

  if (!matched) {
    return null;
  }

  return (await admin.auth().verifyIdToken(matched[1])).uid;
};

// Prisma

const prisma = new PrismaClient();

const upsertPatient = (
  patientId: string,
  patientInsuranceCard: PatientInsuranceCard
) =>
  prisma.patient.upsert({
    where: {
      id: patientId,
    },
    update: patientInsuranceCard,
    create: {
      ...patientInsuranceCard,
      id: patientId,
    },
  });

const upsertPatientRecord = (
  patientId: string,
  patientRecord: Omit<PatientRecord, "diseases">
) =>
  prisma.patientRecord.upsert({
    where: {
      patientId,
    },
    create: {
      ...patientRecord,
      patientId,
    },
    update: patientRecord,
  });

// CRUD

const post = async (request: VercelRequest, response: VercelResponse) => {
  const patientId = await getPatientId(request.headers);
  const patientInsuranceCard = request.body as PatientInsuranceCard;

  if (
    !patientId ||
    !patientInsuranceCard.accessToken ||
    !patientInsuranceCard.accessTokenSecret
  ) {
    return response.status(400).end();
  }

  const patientRecord = await getPatientRecordFromTwitter(patientInsuranceCard);

  await prisma.$transaction([
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
      return response.status(404).end();
  }
};
