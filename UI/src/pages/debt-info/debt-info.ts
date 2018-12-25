import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController } from 'ionic-angular';
import { DebtEditorPage } from '../debt-editor/debt-editor';
import { Debt, DebtStatus, DebtType } from '../../models/debt';
import { DebtsProvider } from '../../providers/debts/debts';

import superlogin from 'superlogin-client';
import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';

@IonicPage()
@Component({
  selector: 'page-debt-info',
  templateUrl: 'debt-info.html',
})
export class DebtInfoPage {

  debt: Debt;
  debtType: DebtType;

  constructor(private modalCtrl: ModalController,
    private navParams: NavParams,
    private debtsProvider: DebtsProvider,
    private dialogUtilities: DialogUtilitiesProvider) {
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
    this.dialogUtilities.openSkype(this.debt.borrower.skypeId);
  }

  openSMS() {
    this.dialogUtilities.openSMS(this.debt.borrower.cellNumber);
  }

  openMessenger() {
    this.dialogUtilities.openMessenger(this.debt.borrower.messengerId);
  }

  openMap() {
    this.dialogUtilities.openMap(this.debt.borrower.address);
  }

}
