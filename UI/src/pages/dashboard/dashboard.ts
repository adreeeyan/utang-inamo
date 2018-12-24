import { Component } from '@angular/core';
import { IonicPage, LoadingController, ToastController, Events } from 'ionic-angular';
import { DebtsProvider } from '../../providers/debts/debts';
import { DebtStatus, DebtType } from '../../models/debt';

import superlogin from 'superlogin-client';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  user: any;
  totalPayables: any = 0;
  totalReceivables: any = 0;
  isRefreshing: boolean = false;

  constructor(private debtsProvider: DebtsProvider,
    private authProvider: AuthProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private events: Events) {
  }

  ionViewCanEnter() {
    return superlogin.authenticated();
  }

  ionViewWillEnter() {
    this.user = null;
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter DashboardPage');
    try
    {
      await this.refresh();
      console.log("Dashboard finished initializing...");
    }
    catch(e)
    {
      console.log("Shit happened while loading the dashboard", e);
      this.logout();
    }
  }

  async refresh() {
    this.isRefreshing = true;
    this.user = await this.authProvider.getInfo();
    this.totalPayables = await this.getTotalPayables();
    this.totalReceivables = await this.getTotalReceivables();
    this.isRefreshing = false;
  }

  async getTotalPayables() {
    let unpaidAmount = 0;
    try {
      const debts = await this.debtsProvider.getDebts();
      const unpaid = debts.filter(p => p.status == DebtStatus.UNPAID && p.type == DebtType.PAYABLE);
      unpaidAmount = unpaid.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.total;
      }, 0);
      return Promise.resolve(unpaidAmount || 0);
    }
    catch (e) {
      console.log("Issue while retrieving total payables.", e);
    }
    return Promise.resolve(unpaidAmount);
  }

  async getTotalReceivables() {
    let receivableAmount = 0;
    try {
      const debts = await this.debtsProvider.getDebts();
      const unpaid = debts.filter(p => p.status == DebtStatus.UNPAID && p.type == DebtType.RECEIVABLE);
      receivableAmount = unpaid.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);
      return Promise.resolve(receivableAmount || 0);
    }
    catch (e) {
      console.log("Issue while retrieving total receivables.", e);
    }
    return Promise.resolve(receivableAmount);
  }


  openPayablesPage() {
    this.events.publish("tab:selectPayables");
  }

  openReceivablesPage() {
    this.events.publish("tab:selectReceivables");
  }

  async logout() {
    let loading = this.loadingCtrl.create({
      content: "Logging out..."
    });
    loading.present();

    try {
      await this.authProvider.logout();
      this.events.publish("user:logout");
    }
    catch (e) {
      console.log("Problem logging out.", JSON.stringify(e));
      this.toastCtrl.create({
        message: "Hold on tight, there's an issue logging out.",
        duration: 3000,
        showCloseButton: true
      }).present();
    }
    finally {
      loading.dismiss();
    }
  }
}
