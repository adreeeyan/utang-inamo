import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Debt, DebtType, DebtStatus } from '../../models/debt';
import { Borrower } from '../../models/borrower';
import { DebtInfoPage } from '../debt-info/debt-info';
import { DebtEditorPage } from '../debt-editor/debt-editor';
import { DebtsProvider } from '../../providers/debts/debts';

import superlogin from 'superlogin-client';

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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private debtsProvider: DebtsProvider) {
  }

  ionViewCanEnter() {
    return superlogin.authenticated();
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter DebtListingPage');
    this.debtType = this.navParams.get("type");
    this.isPaid = "unpaid";
    this.debts = this.debtType == DebtType.PAYABLE ? await this.getPayables() : await this.getReceivables();
  }

  async getPayables() {
    let payables = [];
    try {
      const debts: Debt[] = await this.debtsProvider.getDebts();
      payables = debts.filter(debt => debt.type == DebtType.PAYABLE);
    }
    catch (e) {
      console.log("Issue while retrieving payables.", e);
    }
    return payables;
  }

  async getReceivables() {
    let receivables = [];
    try {
      const debts: Debt[] = await this.debtsProvider.getDebts();
      receivables = debts.filter(debt => debt.type == DebtType.RECEIVABLE);
    }
    catch (e) {
      console.log("Issue while retrieving receivables.", e);
    }
    return receivables;
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

  goToDebtInfo(debt) {
    this.navCtrl.push(DebtInfoPage, { id: debt.id || debt._id });
  }

  goToDebtEditor(debt) {
    if (debt) {
      this.navCtrl.push(DebtEditorPage, { id: debt.id || debt._id, type: this.debtType });
    } else {
      this.navCtrl.push(DebtEditorPage, { type: this.debtType });
    }
  }

  openSkype(borrower: Borrower) {
    window.open(`skype:${borrower.skypeId}?chat`, "_system");
  }

  openSMS(borrower: Borrower) {
    window.open(`sms://${borrower.cellNumber}`, "_system");
  }

  openMessenger(borrower: Borrower) {
    window.open(`https://m.me/${borrower.messengerId}`, "_system");
  }

}
