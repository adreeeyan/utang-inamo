import { getUser, getDebt } from "./common";
import { https } from "firebase-functions";

export const getDebtInfo = https.onCall(async (data: any, context: any) => {
    console.log("Retrieving debt data: ", data);
    const debt: any = await getDebt(data.userId, data.debtId);
    return debt;
});

export const getUserInfo = https.onCall(async (data: any, context: any) => {
    console.log("Retrieving user data: ", data);
    const user: any = await getUser(data.userId);
    return user;
});