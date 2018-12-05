import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DebtEditorPage } from '../debt-editor/debt-editor';
import { Debt } from '../../models/debt';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-debt-info',
  templateUrl: 'debt-info.html',
})
export class DebtInfoPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider) {
  }

  ionViewCanEnter(): Promise<any> {
    return this.authProvider.isAuthenticated();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DebtInfoPage');
  }

  goToDebtEditor(debt: Debt) {
    this.navCtrl.push(DebtEditorPage, { id: "1" });
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
