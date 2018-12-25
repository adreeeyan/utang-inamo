import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController } from 'ionic-angular';
import { DebtEditorPage } from '../debt-editor/debt-editor';
import { Debt, DebtStatus, DebtType } from '../../models/debt';
import { DebtsProvider } from '../../providers/debts/debts';

import superlogin from 'superlogin-client';

@IonicPage()
@Component({
  selector: 'page-debt-info',
  templateUrl: 'debt-info.html',
})
export class DebtInfoPage {

  debt: Debt;
  debtType: DebtType;

  constructor(public modalCtrl: ModalController,
    public navParams: NavParams,
    private debtsProvider: DebtsProvider) {
  }

  ionViewCanEnter() {
    return superlogin.authenticated();
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter DebtInfoPage');
    this.debt = new Debt(await this.getDebt(this.navParams.get("id")));

    this.debtType = this.navParams.get("type");
    if (this.debtType == null) {
      // then user navigated here directly via url
      // get type via url
      this.debtType = window.location.hash.includes("payables") ||
        window.location.hash.includes("dashboard")
        ? DebtType.PAYABLE : DebtType.RECEIVABLE;
    }
  }

  async getDebt(id) {
    let debt = null;
    try {
      debt = await this.debtsProvider.getDebt(id);
    }
    catch (e) {
      console.log("Issue while retrieving debt.", e);
    }

    return Promise.resolve(debt);
  }

  setDebtAsPaid() {
    this.debt.status = DebtStatus.PAID;
    this.debtsProvider.updateDebt(this.debt);
  }

  setDebtAsUnpaid() {
    this.debt.status = DebtStatus.UNPAID;
    this.debtsProvider.updateDebt(this.debt);
  }

  get isDebtPaid() {
    return this.debt.status == DebtStatus.PAID;
  }

  goToDebtEditor() {
    const debtEditorModal = this.modalCtrl.create(DebtEditorPage, { id: this.debt.id, type: this.debtType });
    debtEditorModal.present();
  }

  openSkype() {
    window.open(`skype:${this.debt.borrower.skypeId}?chat`, "_system");
  }

  openSMS() {
    window.open(`sms://${this.debt.borrower.cellNumber}`, "_system");
  }

  openMessenger() {
    window.open(`https://m.me/${this.debt.borrower.messengerId}`, "_system");
  }

  openMap() {
    const isApp = document.URL.indexOf("http") !== 0;
    if (isApp) {
      window.open("geo:0,0?q=compostela+cebu", "_system");
    } else {
      window.open("https://www.google.com/maps/dir/?api=1&destination=compostela%20%cebu", "_system");
    }
  }

}
