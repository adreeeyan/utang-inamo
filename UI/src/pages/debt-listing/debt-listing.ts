import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController } from 'ionic-angular';
import { Debt, DebtType, DebtStatus } from '../../models/debt';
import { Borrower } from '../../models/borrower';
import { DebtInfoPage } from '../debt-info/debt-info';
import { DebtEditorPage } from '../debt-editor/debt-editor';
import { DebtsProvider } from '../../providers/debts/debts';

import superlogin from 'superlogin-client';
import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';

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
    private dialogUtilities: DialogUtilitiesProvider) {
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

  isDebtPaid(debt: Debt) {
    return debt.status == DebtStatus.PAID;
  }

  isDebtPayable(debt: Debt) {
    return debt.type == DebtType.PAYABLE;
  }

  get debtsToShow() {
    const toShow = this.isPaid == "paid" ? this.paid : this.unpaid;
    toShow.sort((a, b) => new Date(b.borrowedDate).getTime() - new Date(a.borrowedDate).getTime());
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

  openSkype(borrower: Borrower) {
    this.dialogUtilities.openSkype(borrower.skypeId);
  }

  openSMS(borrower: Borrower) {
    this.dialogUtilities.openSMS(borrower.cellNumber);
  }

  openMessenger(borrower: Borrower) {
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
