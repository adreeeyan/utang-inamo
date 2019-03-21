import { Injectable } from '@angular/core';
import { Debt } from '../../models/debt';
import { User } from '../../models/user';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable()
export class PublicDebtProvider {

  constructor(private fireFunctions: AngularFireFunctions) {
    console.log('Hello PublicDebtProvider Provider');
  }

  getDebt(userId, debtId) {
    return new Promise(async (resolve, reject) => {
      try {
        const retriever = this.fireFunctions.httpsCallable("getDebtInfo");
        const debt = await retriever({ userId: userId, debtId: debtId }).toPromise();
        console.log("Get debt successful");
        resolve(new Debt({ ...debt }));
      } catch (e) {
        console.log("Get debt failed", e);
        reject(e.message);
      }
    });
  }

  getUser(userId): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        const retriever = this.fireFunctions.httpsCallable("getUserInfo");
        const user = await retriever({ userId: userId }).toPromise();
        console.log("Get user successful");
        resolve(new User({ ...user }));
      } catch (e) {
        console.log("Get user failed", e);
        reject(e.message);
      }
    });
  }

}
