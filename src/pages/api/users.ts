import { IncomingHttpHeaders } from "http";
import { PrismaClient } from "@prisma/client";
import { VercelRequest, VercelResponse } from "@vercel/node";
import * as admin from "firebase-admin";
import Twitter from "twitter";
import {
  UserCredential,
  UserProfile,
} from "../../domains/authentication/models";
import { parse } from "../../utils/json";

// Firebase Admin

admin.initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

// Helper Functions

const getTwitterAccountVerifyCredentials = ({
  accessToken,
  accessTokenSecret,
}: UserCredential): Promise<UserProfile> =>
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
        id: data.id,
        image: data.profile_image_url_https,
        name: data.name,
        screenName: data.screen_name,
      });
    });
  });

const verifyUser = async ({
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

const upsertUser = async (userId: string, userCredential: UserCredential) =>
  prisma.user.upsert({
    where: {
      id: userId,
    },
    update: userCredential,
    create: {
      ...userCredential,
      id: userId,
    },
  });

const upsertUserProfile = async (
  userId: string,
  userCredential: UserCredential
) => {
  const profile = await getTwitterAccountVerifyCredentials(userCredential);

  return prisma.userProfile.upsert({
    where: {
      userId,
    },
    create: {
      ...profile,
      userId,
    },
    update: profile,
  });
};

// CRUD

const post = async (request: VercelRequest, response: VercelResponse) => {
  const userCredential = parse<UserCredential>(request.body);
  const userId = await verifyUser(request.headers);

  if (!userCredential || !userId) {
    return response.status(400).end();
  }

  const [_, profile] = await prisma.$transaction([
    upsertUser(userId, userCredential),
    upsertUserProfile(userId, userCredential),
  ]);

  response.send({
    id: profile.id,
    image: profile.image,
    name: profile.name,
    screenName: profile.screenName,
  } as UserProfile);
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
