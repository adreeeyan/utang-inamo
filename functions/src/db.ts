import { firestore } from "firebase-admin";

const theDb = firestore();

export const db = theDb;