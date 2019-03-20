import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController, NavController, Events } from 'ionic-angular';
import { Debt, DebtType, DebtStatus } from '../../models/debt';
import { DebtInfoPage } from '../debt-info/debt-info';
import { DebtEditorPage } from '../debt-editor/debt-editor';
import { DebtsProvider } from '../../providers/debts/debts';

import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';
import { UserStatus, User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { SignInPage } from '../sign-in/sign-in';

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

  constructor(private navParams: NavParams,
    private debtsProvider: DebtsProvider,
    private modalCtrl: ModalController,
    private dialogUtilities: DialogUtilitiesProvider,
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

    if (this.debtType == DebtType.PAYABLE) {
      this.getPayables();
    } else {
      this.getReceivables();
    }
  }

  async doRefreshFromPull(refresher) {
    await this.refresh();
    refresher.complete();
  }

  async getPayables() {
    this.debtsProvider.getPayables().subscribe(debts => this.debts = debts);
  }

  async getReceivables() {
    this.debtsProvider.getReceivables().subscribe(debts => this.debts = debts);
  }

  isDebtPaid(debt: Debt) {
    return debt.status == DebtStatus.PAID;
  }

  isDebtPayable(debt: Debt) {
    return debt.type == DebtType.PAYABLE;
  }

  isBorrowerDeleted(debt: Debt) {
    const borrower: any = debt.borrower;
    return borrower && borrower.status == UserStatus.DELETED;
  }

  get debtsToShow() {
    const toShow = this.isPaid == "paid" ? this.paid : this.unpaid;
    return toShow;
  }

  get title() {
    return this.debtType == DebtType.PAYABLE ? "PAYABLES" : "RECEIVABLES";
  }

  get paidTabText() {
    return this.debtType == DebtType.PAYABLE ? "Paid" : "Received";
  }

  get unpaidTabText() {
    return this.debtType == DebtType.PAYABLE ? "Unpaid" : "Unreceived";
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

  get emptyPlaceholder() {
    if (this.debtType == DebtType.PAYABLE && this.isPaid == "paid") {
      return {
        image: "assets/imgs/payables_paid.png",
        text: "You haven't tried paying a debt? That's weird..."
      };
    } else if (this.debtType == DebtType.PAYABLE && this.isPaid == "unpaid") {
      return {
        image: "assets/imgs/payables_unpaid.png",
        text: "You got no debts! How can that be???"
      };
    } else if (this.debtType == DebtType.RECEIVABLE && this.isPaid == "paid") {
      return {
        image: "assets/imgs/receivables_paid.png",
        text: "Time to contact those indebted to you!"
      };
    } else if (this.debtType == DebtType.RECEIVABLE && this.isPaid == "unpaid") {
      return {
        image: "assets/imgs/receivables_unpaid.png",
        text: "You are broke, you don't have any receivable..."
      };
    }
    return null;
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

  openSkype(borrower: User) {
    this.dialogUtilities.openSkype(borrower.skypeId);
  }

  async openSMS(debt) {
    let message = await this.dialogUtilities.createSMSMessage(debt);
    this.dialogUtilities.openSMS(debt.borrower.cellNumber, message);
  }

  openMessenger(borrower: User) {
    this.dialogUtilities.openMessenger(borrower.messengerId);
  }

  getDueDateStringPart(debt) {
    if (!this.isDebtPaid(debt) && (debt.dueDate == null || debt.dueDate == "")) {
      return "No due";
    }

    if (!this.isDebtPaid(debt) && debt.dueDate != null && debt.dueDate != "") {
      return `Due on ${debt.dueDateString}`;
    }

    if (this.isDebtPaid(debt)) {
      return `Paid last ${debt.paidDateString}`;
    }
  }

}
