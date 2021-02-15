import firebase from "firebase/app";
import "firebase/auth";
import { store } from "..";
import * as api from "~/utils/api";

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

export { firebase };

// API

export const get: typeof api.get = (endpoint, options) =>
  api.post(endpoint, {
    ...options,
    headers: {
      ...options,
      Authorization: `Token ${store.getState().authentication.token}`,
    },
  });

export const post: typeof api.post = (endpoint, data, options) =>
  api.post(endpoint, data, {
    ...options,
    headers: {
      ...options,
      Authorization: `Token ${store.getState().authentication.token}`,
    },
  });
