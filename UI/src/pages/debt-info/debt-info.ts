import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController } from 'ionic-angular';
import { DebtEditorPage } from '../debt-editor/debt-editor';
import { Debt, DebtStatus, DebtType } from '../../models/debt';
import { DebtsProvider } from '../../providers/debts/debts';

import superlogin from 'superlogin-client';
import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';
import { BorrowerInfoPage } from '../borrower-info/borrower-info';
import { BorrowerStatus } from '../../models/borrower';
import { FormatCurrencyPipe } from '../../pipes/format-currency/format-currency';

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
    private dialogUtilities: DialogUtilitiesProvider,
    private formatCurrencyPipe: FormatCurrencyPipe) {
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

  openBorrowerInfo() {
    const borrower: any = this.debt.borrower;
    if (borrower.status == BorrowerStatus.DELETED) {
      return;
    }

    const data = { borrower: borrower.id || borrower._id };
    let borrowerInfoModal = this.modalCtrl.create(BorrowerInfoPage, data);
    borrowerInfoModal.present();
  }

  setDebtAsPaid() {
    this.debt.status = DebtStatus.PAID;
    this.debt.paidDate = new Date();
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
    let message = "";
    if (this.debt.type == DebtType.RECEIVABLE && this.debt.status == DebtStatus.UNPAID) {
      message = `Hi ${this.debt.borrower.name},\r\n\r\nI would like to follow up for your debt amounting to ${this.formatCurrencyPipe.transform(this.debt.total)}.\r\n\r\nYou can find the info here:\r\nhttps://adrianonrails.github.io/utang-inamo/#/tab/payables/debt-list`;
    }
    this.dialogUtilities.openSMS(this.debt.borrower.cellNumber, message);
  }

  openMessenger() {
    this.dialogUtilities.openMessenger(this.debt.borrower.messengerId);
  }

  openMap() {
    this.dialogUtilities.openMap(this.debt.borrower.address);
  }

  get dueDateStringPart() {
    if (!this.isDebtPaid && (this.debt.dueDate == null || this.debt.dueDate == "")) {
      return "No due";
    }

    if (!this.isDebtPaid && this.debt.dueDate != null && this.debt.dueDate != "") {
      return `Due on ${this.debt.dueDateString}`;
    }

    if (this.isDebtPaid) {
      return `Paid last ${this.debt.paidDateString}`;
    }
  }

}
