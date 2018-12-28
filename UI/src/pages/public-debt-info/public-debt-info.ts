import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Debt, DebtStatus } from '../../models/debt';
import { User } from '../../models/user';
import { PublicDebtProvider } from '../../providers/public-debt/public-debt';
import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';

@IonicPage()
@Component({
  selector: 'page-public-debt-info',
  templateUrl: 'public-debt-info.html',
})
export class PublicDebtInfoPage {

  debt: Debt = new Debt();
  user: User = new User();

  constructor(private navParams: NavParams,
    private publicDebtProvider: PublicDebtProvider,
    private dialogUtilities: DialogUtilitiesProvider) {
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter PublicDebtInfoPage');
    await this.refresh();
  }

  async refresh() {
    try {
      this.dialogUtilities.showLoading("I'm retrieving your debt...");
      const userId = this.navParams.get("userid");
      const debtId = this.navParams.get("debtid");
      if (userId == null || debtId == null) {
        return;
      }
      this.debt = new Debt(await this.getDebt(userId, debtId));
      this.user = await this.getUser(userId);
    } catch (e) {
      console.log("There was an error while retrieving public debt info", e);
    }
    finally {
      this.dialogUtilities.hideLoading();
    }
  }

  async getDebt(userId, debtId) {
    let debt = null;
    try {
      debt = await this.publicDebtProvider.getDebt(userId, debtId);
    }
    catch (e) {
      console.log("Issue while retrieving debt.", e);
    }

    return Promise.resolve(debt);
  }

  async getUser(userId) {
    return await this.publicDebtProvider.getUser(userId);
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
