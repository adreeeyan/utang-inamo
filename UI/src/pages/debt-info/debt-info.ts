import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { DebtEditorPage } from '../debt-editor/debt-editor';
import { Debt } from '../../models/debt';
import { AuthProvider } from '../../providers/auth/auth';
import { DebtsProvider } from '../../providers/debts/debts';

@IonicPage()
@Component({
  selector: 'page-debt-info',
  templateUrl: 'debt-info.html',
})
export class DebtInfoPage {

  debt: Debt;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private debtsProvider: DebtsProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter DebtInfoPage');
    this.debt = new Debt(await this.getDebt(this.navParams.get("id")));
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

  goToDebtEditor() {
    this.navCtrl.push(DebtEditorPage, { id: this.debt.id });
  }

  openMessenger() {
    window.open("https://m.me/john.doe", "_system");
  }

  openSkype() {
    window.open("skype:kddp.adrian?chat", "_system");
  }

  openSMS() {
    window.open("sms://09424238867", "_system");
  }

  openMap() {
    const isApp = document.URL.indexOf("http") !== 0;
    if (isApp) {
      window.open("geo:0,0?q=compostela+cebu", "_system");
    } else {
      window.open("https://www.google.com/maps/dir/?api=1&destination=compostela%20%cebu", "_system");
    }
  }

}
