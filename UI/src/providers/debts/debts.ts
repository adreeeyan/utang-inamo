import { Injectable } from "@angular/core";
import PouchDB from "pouchdb";
import { Debt } from "../../models/debt";
import { Borrower } from "../../models/borrower";
import { Events } from "ionic-angular";

@Injectable()
export class DebtsProvider {

  private data: any;
  private db: any;
  private remote: any;

  private isFinishInitializing: boolean = false;

  constructor(private events: Events) {
    console.log("Hello DebtsProvider Provider");
    this.isFinishInitializing = false;
  }

  init(details) {

    this.events.publish("user:startsync");

    this.db = new PouchDB("utang-inamo");

    this.remote = details.userDBs.utanginamo;

    this.db.replicate.from(this.remote)
      .on("complete", () => {
        console.log("Shits finished syncing...");
        this.isFinishInitializing = true;

        // Do some live syncing
        let options = {
          live: true,
          retry: true,
          continuous: true
        };
        this.db.sync(this.remote, options);

        this.events.publish("user:endsync");
      });
  }

  IsInitizialized() {
    return new Promise(resolve => {
      let initializeCheckerInterval = setInterval(() => {
        if (this.isFinishInitializing) {
          clearInterval(initializeCheckerInterval);
          resolve(true);
        }
      }, 500);
    });
  }

  async logout(): Promise<any> {
    try {
      this.data = null;
      await this.db.destroy();
      console.log("database removed");
      this.isFinishInitializing = false;
      return Promise.resolve(true);
    }
    catch (e) {
      return Promise.reject(e);
    }
  }

  getDocs() {

    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(async (resolve) => {

      await this.IsInitizialized();

      this.db.allDocs({

        include_docs: true

      }).then((result) => {

        this.data = [];

        result.rows.map((row) => {
          this.data.push({ ...row.doc, id: row.doc._id });
        });

        resolve(this.data);

        this.db.changes({ live: true, since: "now", include_docs: true }).on("change", (change) => {
          this.handleChange(change);
        });

      }).catch((error) => {

        console.log(error);

      });

    });

  }

  async getDebts() {
    try {
      const allDocs: any[] = await this.getDocs();
      const allDebts = allDocs.filter(doc => doc.borrower != null);
      const allDebtsWithBorrower = allDebts.map(debt => {
        const borrower = allDocs.find(doc => doc._id == debt.borrower);
        return new Debt({
          ...debt,
          borrower: borrower
        });
      });
      return Promise.resolve(allDebtsWithBorrower);
    }
    catch (e) {
      return Promise.reject(e);
    }
  }

  async getDebt(id) {
    try {
      const allDebts: any[] = await this.getDebts();
      return Promise.resolve(allDebts.find(doc => doc._id == id));
    }
    catch (e) {
      return Promise.reject(e);
    }
  }

  createDebt(debt) {
    debt = {
      ...debt,
      borrower: debt.borrower._id
    }
    this.db.post(debt);
  }

  updateDebt(debt) {
    debt = {
      ...debt,
      borrower: debt.borrower._id
    }
    this.db.put(debt).catch((err) => {
      console.log(err);
    });
  }

  deleteDebt(debt) {
    this.db.remove(debt).catch((err) => {
      console.log(err);
    });
  }

  handleChange(change) {

    let changedDoc = null;
    let changedIndex = null;

    this.data.forEach((doc, index) => {

      if (doc._id === change.id) {
        changedDoc = doc;
        changedIndex = index;
      }

    });

    // A document was deleted
    if (change.deleted) {
      this.data.splice(changedIndex, 1);
    }
    else {

      // A document was updated
      if (changedDoc) {
        this.data[changedIndex] = change.doc;
      }

      // A document was added
      else {
        this.data.push(change.doc);
      }

    }

  }

  async getBorrowers() {
    try {
      const allDocs: any[] = await this.getDocs();
      const allBorrowers = allDocs.filter(doc => doc.firstName != null);
      const mapped = allBorrowers.map(borrower => new Borrower(borrower));
      return Promise.resolve(mapped);
    }
    catch (e) {
      return Promise.reject(e);
    }
  }

  async getBorrower(id) {
    try {
      const allBorrowers: any[] = await this.getBorrowers();
      return Promise.resolve(allBorrowers.find(doc => doc._id == id));
    }
    catch (e) {
      return Promise.reject(e);
    }
  }

  createBorrower(borrower) {
    this.db.post(borrower);
  }

}
