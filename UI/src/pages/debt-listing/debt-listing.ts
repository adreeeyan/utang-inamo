import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
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
    private debtsProvider: DebtsProvider,
    private modalCtrl: ModalController) {
  }

  ionViewCanEnter() {
    return superlogin.authenticated();
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad DebtListingPage');
    await this.refresh();
  }

  async refresh() {
    this.debtType = this.navParams.get("type");
    if (this.debtType == null) {
      // then user navigated here directly via url
      // get type via url
      this.debtType = window.location.hash.includes("payables") ||
        window.location.hash.includes("dashboard")
        ? DebtType.PAYABLE : DebtType.RECEIVABLE;
    }

    this.debts = this.debtType == DebtType.PAYABLE ? await this.getPayables() : await this.getReceivables();
  }

  async doRefreshFromPull(refresher) {
    await this.refresh();
    refresher.complete();
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
    let debtInfoModal = this.modalCtrl.create(DebtInfoPage, { id: debt.id || debt._id, type: this.debtType });

    debtInfoModal.onDidDismiss(async () => {
      await this.refresh();
    });
    debtInfoModal.present();
  }

  goToDebtEditor(debt) {
    let debtEditorModal;

    if (debt) {
      debtEditorModal = this.modalCtrl.create(DebtEditorPage, { id: debt.id || debt._id, type: this.debtType });
    } else {
      debtEditorModal = this.modalCtrl.create(DebtEditorPage, { type: this.debtType });
    }

    debtEditorModal.onDidDismiss(async () => {
      await this.refresh();
    });
    debtEditorModal.present();
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
