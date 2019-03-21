import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController, Events } from 'ionic-angular';
import { DebtEditorPage } from '../debt-editor/debt-editor';
import { Debt, DebtStatus, DebtType } from '../../models/debt';
import { DebtsProvider } from '../../providers/debts/debts';

import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';
import { BorrowerInfoPage } from '../borrower-info/borrower-info';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { User, UserStatus } from '../../models/user';
import * as moment from "moment";
import { AuthProvider } from '../../providers/auth/auth';

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
    private utilities: UtilitiesProvider,
    private events: Events,
    private authProvider: AuthProvider) {
  }

  ionViewCanEnter() {
    const isLoggedIn = this.authProvider.isLoggedIn;

    // redirect to sign in page if not logged in
    if(!isLoggedIn) {
      this.events.publish("user:logout");
    }

    return isLoggedIn;
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter DebtInfoPage');

    this.getDebt(this.navParams.get("id"));

    this.debtType = this.navParams.get("type");
    if (this.debtType == null) {
      // then user navigated here directly via url
      // get type via url
      this.debtType = window.location.hash.includes("payables") ||
        window.location.hash.includes("dashboard")
        ? DebtType.PAYABLE : DebtType.RECEIVABLE;
    }
  }

  getDebt(id) {
    try {
      this.debtsProvider.getDebt(id).subscribe(debt => this.debt = debt);
    }
    catch (e) {
      console.log("Issue while retrieving debt.", e);
    }
  }

  openBorrowerInfo() {
    const borrower: any = this.debt.borrower;
    if (this.isBorrowerDeleted) {
      return;
    }

    const data = { borrower: borrower.id || borrower._id };
    let borrowerInfoModal = this.modalCtrl.create(BorrowerInfoPage, data);
    borrowerInfoModal.present();
  }

  get isBorrowerDeleted() {
    const borrower = this.debt.borrower as User;
    return borrower && borrower.status == UserStatus.DELETED;
  }

  setDebtAsPaid() {
    this.debt.status = DebtStatus.PAID;
    this.debt.paidDate = moment().format();
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
    const borrower = this.debt.borrower as User;
    this.dialogUtilities.openSkype(borrower.skypeId);
  }

  async openSMS() {
    const borrower = this.debt.borrower as User;
    let message = await this.dialogUtilities.createSMSMessage(this.debt);
    this.dialogUtilities.openSMS(borrower.cellNumber, message);
  }

  openMessenger() {
    const borrower = this.debt.borrower as User;
    this.dialogUtilities.openMessenger(borrower.messengerId);
  }

  openMap() {
    const borrower = this.debt.borrower as User;
    this.dialogUtilities.openMap(borrower.address);
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

  async openPublicDebtPage() {
    const debt: any = this.debt;
    this.dialogUtilities.openGenericLink(await this.utilities.createPublicDebtInfoUrl(debt.id || debt._id));
  }

}
