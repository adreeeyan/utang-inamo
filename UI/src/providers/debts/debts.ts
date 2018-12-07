import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import PouchDB from "pouchdb";
import { Debt } from "../../models/debt";
import { Borrower } from "../../models/borrower";

@Injectable()
export class DebtsProvider {

  private data: any;
  private db: any;
  private remote: any;

  constructor(private http: HttpClient) {
    console.log("Hello DebtsProvider Provider");
  }

  init(details) {

    this.db = new PouchDB("utang-inamo");

    this.remote = details.userDBs.utanginamo;

    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.db.sync(this.remote, options);

    console.log(this.db);

  }

  logout() {

    this.data = null;

    this.db.destroy().then(() => {
      console.log("database removed");
    });
  }

  getDocs() {

    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {

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
