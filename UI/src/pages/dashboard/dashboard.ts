import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { SignInPage } from '../sign-in/sign-in';
import { DebtsProvider } from '../../providers/debts/debts';
import { DebtStatus, DebtType } from '../../models/debt';
import { DebtListingPage } from '../debt-listing/debt-listing';

import superlogin from 'superlogin-client';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  user: any;
  totalPayables: any;
  totalReceivables: any;

  constructor(private navCtrl: NavController,
    private debtsProvider: DebtsProvider,
    private authProvider: AuthProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController, ) {
  }

  ionViewCanEnter() {
    return superlogin.authenticated();
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter DashboardPage');

    this.user = await this.authProvider.getInfo();
    this.totalPayables = await this.getTotalPayables();
    this.totalReceivables = await this.getTotalReceivables();
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
    this.navCtrl.push(DebtListingPage, { type: DebtType.PAYABLE });
  }

  openReceivablesPage() {
    this.navCtrl.push(DebtListingPage, { type: DebtType.RECEIVABLE });
  }

  async logout() {
    let loading = this.loadingCtrl.create({
      content: "Logging out..."
    });
    loading.present();

    try {
      await this.authProvider.logout();
      this.navCtrl.setRoot(SignInPage);
    }
    catch (e) {
      console.log("Problem logging out.", e);
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
