import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import superlogin from 'superlogin-client';
import { Debt } from '../../models/debt';
import { Borrower } from '../../models/borrower';

@Injectable()
export class PublicDebtProvider {

  constructor(public http: HttpClient) {
    console.log('Hello PublicDebtProvider Provider');
  }

  getDebt(userId, debtId) {
    return new Promise(async (resolve, reject) => {
      try {
        let response: any = await superlogin.getHttp().get(`public-debt-info/${userId}/${debtId}`);
        response = response.data;
        if (response.status == "error") {
          reject(response.status.error);
        } else {
          const debt = new Debt({
            ...response.debt,
            borrower: new Borrower({ ...response.debt.borrower }),
            id: response.debt._id
          });
          resolve(debt);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  getUser(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let response: any = await superlogin.getHttp().get(`user/${userId}`);
        response = response.data;
        if (response.status == "error") {
          reject(response.status.error);
        } else {
          resolve(response.user);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

}
