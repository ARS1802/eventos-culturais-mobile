import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error(
    "Defina GOOGLE_APPLICATION_CREDENTIALS com o caminho absoluto do JSON da service account antes de rodar scripts admin.",
  );
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: applicationDefault(),
    });

export const adminDb = getFirestore(app);
