import { db } from "./db";

// get user detail
export const getUser = (id: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            db.collection("users").doc(id).get()
                .then((doc: any) => {
                    if (doc.exists) {
                        resolve(doc.data());
                    } else {
                        reject("No user found");
                    }
                }).catch(() => {
                    reject("No user found");
                });
        } catch (e) {
            console.log("Get user failed", e);
            reject(e.message);
        }
    });
}

// get debt detail
export const getDebt = (userId: string, debtId: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            db.collection(`users/${userId}/debts`).doc(debtId).get()
                .then((doc: any) => {
                    if (doc.exists) {
                        resolve(doc.data());
                    } else {
                        reject("No debt found");
                    }
                }).catch(() => {
                    reject("No debt found");
                });
        } catch (e) {
            console.log("Get debt failed", e);
            reject(e.message);
        }
    });
}