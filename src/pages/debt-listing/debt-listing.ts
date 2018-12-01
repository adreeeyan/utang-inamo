import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Debt, DebtType, DebtStatus } from '../../models/debt';
import { Borrower } from '../../models/borrower';
import { DebtInfoPage } from '../debt-info/debt-info';

@IonicPage()
@Component({
  selector: 'page-debt-listing',
  templateUrl: 'debt-listing.html',
})
export class DebtListingPage {

  // Instance variables
  debtType: DebtType;
  isPaid: string = "unpaid";
  debts: Debt[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DebtListingPage');
    this.debtType = this.navParams.get("type");
    this.isPaid = "unpaid";
    this.debts = this.debtType == DebtType.PAYABLE ? this.getPayables() : this.getReceivables();
  }

  getPayables() {
    let list = [];
    for (let x = 0; x < 30; x++) {
      let dueDate = new Date();
      dueDate.setDate(dueDate.getDay() + (Math.random() * 30))

      list.push(new Debt({
        type: DebtType.PAYABLE,
        borrower: new Borrower({
          lastName: `${x}`,
          firstName: "Person"
        }),
        amount: Math.random() * 3000,
        dueDate: dueDate,
        status: (Math.round(Math.random() * 1 % 2) == 0) ? DebtStatus.PAID : DebtStatus.UNPAID
      }));
    }

    return list;
  }

  getReceivables() {
    let list = [];
    for (let x = 0; x < 30; x++) {
      let dueDate = new Date();
      dueDate.setDate(dueDate.getDay() + (Math.random() * 30))

      list.push(new Debt({
        type: DebtType.RECEIVABLE,
        borrower: new Borrower({
          lastName: `${x}`,
          firstName: "Person"
        }),
        amount: Math.random() * 3000,
        dueDate: dueDate,
        status: (Math.round(Math.random() * 1 % 2) == 0) ? DebtStatus.PAID : DebtStatus.UNPAID
      }));
    }

    return list;
  }

  get title() {
    return this.debtType == DebtType.PAYABLE ? "PAYABLES" : "RECEIVABLES";
  }

  get paid() {
    return this.debts.filter(p => p.status == DebtStatus.PAID);
  }

  get unpaid() {
    return this.debts.filter(p => p.status == DebtStatus.UNPAID);
  }

  get totalPaid() {
    return this.paid.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);
  }

  get totalUnpaid() {
    return this.unpaid.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);
  }

  goToDebtInfo(debt: Debt) {
    this.navCtrl.push(DebtInfoPage, debt);
  }

}
