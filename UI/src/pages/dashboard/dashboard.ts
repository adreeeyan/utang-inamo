import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth/auth';
import { SignInPage } from '../sign-in/sign-in';
import { DebtsProvider } from '../../providers/debts/debts';
import { DebtStatus, DebtType } from '../../models/debt';
import { DebtListingPage } from '../debt-listing/debt-listing';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  user: any;
  totalPayables: any;
  totalReceivables: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private authProvider: AuthProvider,
    private debtsProvider: DebtsProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }

  // async ionViewCanEnter() {
  //   return await this.authProvider.hasCachedUser();
  // }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter DashboardPage');

    // Retrieve user from storage
    this.storage.get("user").then(user => {
      if (user == null) {
        user = {};
      }
      this.user = {
        name: user.firstName || "Hooman",
        picture: user.picture || "assets/imgs/user-placeholder.jpg"
      };
    });

    this.totalPayables = await this.getTotalPayables();
    this.totalReceivables = await this.getTotalReceivables();
  }

  async getTotalPayables() {
    let unpaidAmount = 0;
    try {
      const debts = await this.debtsProvider.getDebts();
      const unpaid = debts.filter(p => p.status == DebtStatus.UNPAID && p.type == DebtType.PAYABLE);
      unpaidAmount = unpaid.reduce((accumulator, currentValue) => 
      {
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
    try
    {
      await this.storage.remove("user");
      // this.authProvider.logout();
    }
    catch(e)
    {
      console.log("Problem logging out.", e);
    }
    finally
    {
      this.navCtrl.setRoot(SignInPage);
    }    
  }

  get isLoggedIn() {
    return this.authProvider.fastIsLoggedIn;
  }

}
