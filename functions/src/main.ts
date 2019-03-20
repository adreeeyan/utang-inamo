import { initializeApp, credential } from "firebase-admin";
const serviceAccount = require("../service-account.json");

initializeApp({
    credential: credential.cert(serviceAccount),
    databaseURL: "https://utang-inamo.firebaseio.com"
});

export * from "firebase-functions";