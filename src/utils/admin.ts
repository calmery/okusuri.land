import { PrismaClient } from "@prisma/client";
import { VercelRequest } from "@vercel/node";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

export const verify = async (
  request: VercelRequest
): Promise<string | null> => {
  const { authorization } = request.headers;

  if (!authorization) {
    return null;
  }

  const matched = authorization.match(/^Token\s+(.+)$/);

  if (!matched) {
    return null;
  }

  return (await admin.auth().verifyIdToken(matched[1])).uid;
};

export const prisma = new PrismaClient();
