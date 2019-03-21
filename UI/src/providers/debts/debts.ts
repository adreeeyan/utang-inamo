import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Debt, DebtType, DebtStatus } from "../../models/debt";
import { Subject } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "../../models/user";

@Injectable()
export class DebtsProvider {

  private user: any;

  private debtsLocation: string = "debts";
  private usersLocation: string = "users";
  private debtsCollection: AngularFirestoreCollection;


  constructor(private fireStore: AngularFirestore,
    private fireAuth: AngularFireAuth) {
    console.log("Hello DebtsProvider Provider");

    // set debts reference
    this.fireAuth.auth.onAuthStateChanged(async user => {
      if (user) {
        this.user = user;
        this.debtsCollection = this.fireStore.collection(`${this.usersLocation}/${user.email}/${this.debtsLocation}`, ref => ref.orderBy("borrowedDate", "desc"));
      } else {
        this.user = null;
        this.debtsCollection = null;
      }
    });
  }

  getDebts(): Subject<Debt[]> {
    let debts$: Subject<Debt[]> = new Subject();
    try {
      this.debtsCollection.snapshotChanges().subscribe(async collection => {
        debts$.next(collection.map(doc => {
          const debt = new Debt({ ...doc.payload.doc.data(), id: doc.payload.doc.id });
          debt.borrower = new User({ ...debt.borrower });
          return debt;
        }));
      });
      return debts$;
    } catch (e) {
      console.log("Get debts failed", e);
      return e.message;
    }
  }

  getPayables(): Subject<Debt[]> {
    let debts$: Subject<Debt[]> = new Subject();
    try {
      const payables = this.fireStore.collection(`${this.usersLocation}/${this.user.email}/${this.debtsLocation}`, ref => {
        return ref.where("type", "==", DebtType.PAYABLE);
      });
      payables.snapshotChanges().subscribe(async collection => {
        debts$.next(collection.map(doc => {
          const debt = new Debt({ ...doc.payload.doc.data(), id: doc.payload.doc.id });
          debt.borrower = new User({ ...debt.borrower });
          return debt;
        }));
      });
      return debts$;
    } catch (e) {
      console.log("Get debts failed", e);
      return e.message;
    }
  }

  getReceivables(): Subject<Debt[]> {
    let debts$: Subject<Debt[]> = new Subject();
    try {
      const receivables = this.fireStore.collection(`${this.usersLocation}/${this.user.email}/${this.debtsLocation}`, ref => {
        return ref.where("type", "==", DebtType.RECEIVABLE);
      });
      receivables.snapshotChanges().subscribe(async collection => {
        debts$.next(collection.map(doc => {
          const debt = new Debt({ ...doc.payload.doc.data(), id: doc.payload.doc.id });
          debt.borrower = new User({ ...debt.borrower });
          return debt;
        }));
      });
      return debts$;
    } catch (e) {
      console.log("Get debts failed", e);
      return e.message;
    }
  }

  getPaidPayables(): Subject<Debt[]> {
    let debts$: Subject<Debt[]> = new Subject();
    try {
      const payables = this.fireStore.collection(`${this.usersLocation}/${this.user.email}/${this.debtsLocation}`, ref => {
        return ref
          .where("type", "==", DebtType.PAYABLE)
          .where("status", "==", DebtStatus.PAID);
      });
      payables.snapshotChanges().subscribe(async collection => {
        debts$.next(collection.map(doc => {
          const debt = new Debt({ ...doc.payload.doc.data(), id: doc.payload.doc.id });
          debt.borrower = new User({ ...debt.borrower });
          return debt;
        }));
      });
      return debts$;
    } catch (e) {
      console.log("Get debts failed", e);
      return e.message;
    }
  }

  getUnpaidPayables(): Subject<Debt[]> {
    let debts$: Subject<Debt[]> = new Subject();
    try {
      const payables = this.fireStore.collection(`${this.usersLocation}/${this.user.email}/${this.debtsLocation}`, ref => {
        return ref
          .where("type", "==", DebtType.PAYABLE)
          .where("status", "==", DebtStatus.UNPAID);
      });
      payables.snapshotChanges().subscribe(async collection => {
        debts$.next(collection.map(doc => {
          const debt = new Debt({ ...doc.payload.doc.data(), id: doc.payload.doc.id });
          debt.borrower = new User({ ...debt.borrower });
          return debt;
        }));
      });
      return debts$;
    } catch (e) {
      console.log("Get debts failed", e);
      return e.message;
    }
  }

  getPaidReceivables(): Subject<Debt[]> {
    let debts$: Subject<Debt[]> = new Subject();
    try {
      const receivables = this.fireStore.collection(`${this.usersLocation}/${this.user.email}/${this.debtsLocation}`, ref => {
        return ref
          .where("type", "==", DebtType.RECEIVABLE)
          .where("status", "==", DebtStatus.PAID);
      });
      receivables.snapshotChanges().subscribe(async collection => {
        debts$.next(collection.map(doc => {
          const debt = new Debt({ ...doc.payload.doc.data(), id: doc.payload.doc.id });
          debt.borrower = new User({ ...debt.borrower });
          return debt;
        }));
      });
      return debts$;
    } catch (e) {
      console.log("Get debts failed", e);
      return e.message;
    }
  }

  getUnpaidReceivables(): Subject<Debt[]> {
    let debts$: Subject<Debt[]> = new Subject();
    try {
      const receivables = this.fireStore.collection(`${this.usersLocation}/${this.user.email}/${this.debtsLocation}`, ref => {
        return ref
          .where("type", "==", DebtType.RECEIVABLE)
          .where("status", "==", DebtStatus.UNPAID);
      });
      receivables.snapshotChanges().subscribe(async collection => {
        debts$.next(collection.map(doc => {
          const debt = new Debt({ ...doc.payload.doc.data(), id: doc.payload.doc.id });
          debt.borrower = new User({ ...debt.borrower });
          return debt;
        }));
      });
      return debts$;
    } catch (e) {
      console.log("Get debts failed", e);
      return e.message;
    }
  }

  getDebt(id): Subject<Debt> {
    try {
      let debt$: Subject<Debt> = new Subject();
      const doc$ = this.debtsCollection.doc(id);
      doc$.snapshotChanges().subscribe(async debt => {
        const debtObj = new Debt({ ...debt.payload.data(), id: debt.payload.id });
        debtObj.borrower = new User({ ...debtObj.borrower });
        debt$.next(debtObj);
      });
      return debt$;
    } catch (e) {
      console.log("Get Debt failed", e);
      return e.message;
    }
  }

  createDebt(debt) {
    return new Promise(async (resolve, reject) => {
      try {
        const docRef = await this.debtsCollection.add(debt.getPureObject());
        console.log("Create debt successful");
        resolve(docRef);
      } catch (e) {
        console.log("Create debt failed", e);
        reject(e.message);
      }
    });
  }

  updateDebt(debt) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.debtsCollection.doc(debt.id).set(debt.getPureObject(), { merge: true });
        console.log("Update debt successful");
        resolve("Update debt successful");
      } catch (e) {
        console.log("Update debt failed", e);
        reject(e.message);
      }
    });
  }

  deleteDebt(debt) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.debtsCollection.doc(debt.id).delete();
        console.log("Delete debt successful");
        resolve("Delete debt successful");
      } catch (e) {
        console.log("Delete debt failed", e);
        reject(e.message);
      }
    });
  }

  // Takes a data URI and returns the Data URI corresponding to the resized image at the wanted size.
  resizedataURL(datas, wantedWidth, wantedHeight) {
    return new Promise(async (resolve, reject) => {

      // We create an image to receive the Data URI
      var img = document.createElement("img");

      // When the event "onload" is triggered we can resize the image.
      img.onload = () => {
        // We create a canvas and get its context.
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        // We set the dimensions at the wanted size.
        canvas.width = wantedWidth;
        canvas.height = wantedHeight;

        // We resize the image with the canvas method drawImage();
        ctx.drawImage(img, 0, 0, wantedWidth, wantedHeight);

        var dataURI = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

        // This is the return of the Promise
        resolve(dataURI);
      };

      // We put the Data URI in the image's src attribute
      img.src = datas;

    });
  }
}
