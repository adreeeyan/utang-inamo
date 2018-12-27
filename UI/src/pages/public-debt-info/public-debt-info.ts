import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Debt, DebtStatus } from '../../models/debt';
import { DebtsProvider } from '../../providers/debts/debts';

@IonicPage()
@Component({
  selector: 'page-public-debt-info',
  templateUrl: 'public-debt-info.html',
})
export class PublicDebtInfoPage {

  debt: Debt;

  constructor(private navParams: NavParams,
    private debtsProvider: DebtsProvider) {
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter PublicDebtInfoPage');
    const userId = this.navParams.get("userid");
    const debtId = this.navParams.get("debtid");
    if (userId == null || debtId == null) {
      return;
    }
    this.debt = new Debt(await this.getDebt(userId, debtId));
  }

  async getDebt(userId, debtId) {
    let debt = null;
    try {
      debt = await this.debtsProvider.getDebtForPublic(userId, debtId);
    }
    catch (e) {
      console.log("Issue while retrieving debt.", e);
    }

    return Promise.resolve(debt);
  }

  get isDebtPaid() {
    return this.debt.status == DebtStatus.PAID;
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
