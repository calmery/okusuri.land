import firebase from "firebase";
import { Branded } from "../types/Branded";

// Custom Errors

export class AuthenticationError extends Error {
  constructor() {
    super();
  }
}

// Types

export type Token = Branded<string, "Token">;

// Firebase

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

// Helper Functions

export const logIn = () =>
  firebase.auth().signInWithRedirect(new firebase.auth.TwitterAuthProvider());

export const subscribe = (callback: (token: Token | null) => void) => {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      return callback(null);
    }

    try {
      return callback((await user.getIdToken(true)) as Token);
    } catch (error) {
      return callback(null);
    }
  });
};
