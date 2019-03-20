import { firestore } from "firebase-functions";
import { db } from "./db";

const USERSLOCATION = "users";
const CONTACTSLOCATION = "contacts";
const DEBTSLOCATION = "debts";

// update all the related field when a contact is updated
export const updateAllContactRelatedFields = firestore
    .document(`${USERSLOCATION}/{userId}/${CONTACTSLOCATION}/{contactId}`)
    .onWrite(async (change: any, context: any) => {
        const document = change.after.exists ? change.after.data() : null;
        const userId = context.params.userId;
        const contactId = context.params.contactId;
        console.log("Updating all the related fields of the contact", contactId);

        // document is deleted
        if (document === null) {
            return;
        }

        const oldDocument = change.before.data();

        // this is a new document
        if (oldDocument === null) {
            return;
        }

        // now we do all the shits

        // update the user in debts/borrower
        db
            .collection(`${USERSLOCATION}/${userId}/${DEBTSLOCATION}`)
            .where("borrower.id", "==", contactId)
            .get()
            .then((doc) => {
                const batch = db.batch();
                doc.forEach(d => {
                    console.log("updating this contact", d.data());
                    batch.set(d.ref, { borrower: document }, { merge: true });
                });
                console.log("commiting the contact changes for", document);
                batch.commit()
                    .then(() => {
                        console.log("Update the user in debts/borrower succeeded");
                    })
                    .catch((e) => {
                        console.log("Update the user in debts/borrower failed", e);
                    });
            })
            .catch((e) => {
                console.log("Update the user in debts/borrower failed", e);
            });
    });