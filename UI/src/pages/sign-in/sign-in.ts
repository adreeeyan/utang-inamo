import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { TabsPage } from '../tabs/tabs';
import { SignUpPage } from '../sign-up/sign-up';
import { DebtsProvider } from '../../providers/debts/debts';

import superlogin from 'superlogin-client';

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  username: any = "adrian";
  password: any = "password";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private debtsProvider: DebtsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
  }

  async login() {
    let loading = this.loadingCtrl.create({
      content: "Logging in..."
    });
    loading.present();

    try {
      const res = await this.authProvider.login(this.username, this.password);
      this.debtsProvider.init(res);
      this.navCtrl.setRoot(TabsPage);
    }
    catch (e) {
      console.log("Problem encountered while logging in.", e);
      this.toastCtrl.create({
        message: e.message || "Cannot login, check your username and password.",
        duration: 3000,
        showCloseButton: true
      }).present();
    }
    finally {
      loading.dismiss();
    }
  }

  async loginViaProvider(provider) {
    let loading = this.loadingCtrl.create({
      content: `Signing in via ${provider}`
    });
    loading.present();

    try {
      let response = await superlogin.socialAuth(provider);
      this.debtsProvider.init(response);
      this.navCtrl.setRoot(TabsPage);
    }
    catch (e) {
      console.log(`shit happens while logging in via ${provider}`, e);
      this.toastCtrl.create({
        message: e || `Problem while signing in via ${provider}`,
        duration: 3000,
        showCloseButton: true
      }).present();
    }
    finally {
      loading.dismiss();
    }
  }

  goToSignUpPage() {
    this.navCtrl.setRoot(SignUpPage);
  }

  goToHomePage() {
    this.navCtrl.setRoot(TabsPage);
  }
}
