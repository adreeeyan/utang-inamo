import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Debt, DebtType, DebtStatus } from '../../models/debt';
import { Borrower } from '../../models/borrower';
import { DebtInfoPage } from '../debt-info/debt-info';
import { DebtEditorPage } from '../debt-editor/debt-editor';
import { AuthProvider } from '../../providers/auth/auth';
import { DebtsProvider } from '../../providers/debts/debts';

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
    private authProvider: AuthProvider,
    private debtsProvider: DebtsProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }

  // ionViewCanEnter(): Promise<any> {
  //   return this.authProvider.hasCachedUser();
  // }

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

    // let list = [];
    // for (let x = 0; x < 30; x++) {
    //   let dueDate = new Date();
    //   dueDate.setDate(dueDate.getDay() + (Math.random() * 30))

    //   list.push(new Debt({
    //     type: DebtType.PAYABLE,
    //     borrower: new Borrower({
    //       lastName: `${x}`,
    //       firstName: "Person"
    //     }),
    //     amount: Math.random() * 3000,
    //     dueDate: dueDate,
    //     status: (Math.round(Math.random() * 1 % 2) == 0) ? DebtStatus.PAID : DebtStatus.UNPAID
    //   }));
    // }

    // return list;
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
    // let list = [];
    // for (let x = 0; x < 30; x++) {
    //   let dueDate = new Date();
    //   dueDate.setDate(dueDate.getDay() + (Math.random() * 30))

    //   list.push(new Debt({
    //     type: DebtType.RECEIVABLE,
    //     borrower: new Borrower({
    //       lastName: `${x}`,
    //       firstName: "Person"
    //     }),
    //     amount: Math.random() * 3000,
    //     dueDate: dueDate,
    //     status: (Math.round(Math.random() * 1 % 2) == 0) ? DebtStatus.PAID : DebtStatus.UNPAID
    //   }));
    // }

    // return list;
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
    this.navCtrl.push(DebtInfoPage, { id: debt.id });
  }

  goToDebtEditor(debt: Debt) {
    if (debt) {
      this.navCtrl.push(DebtEditorPage, { id: debt.id });
    } else {
      this.navCtrl.push(DebtEditorPage);
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
