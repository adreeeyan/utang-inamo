import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { TabsPage } from '../tabs/tabs';
import { SignUpPage } from '../sign-up/sign-up';
import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  username: any = "";
  password: any = "";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private loadingCtrl: LoadingController,
    private dialogUtilities: DialogUtilitiesProvider) {
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
      await this.authProvider.login(this.username, this.password);
      this.navCtrl.setRoot(TabsPage);
    }
    catch (e) {
      console.log("Problem encountered while logging in.", e);
      this.dialogUtilities.showToast(e.message || "Cannot login, check your username and password.");
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
      await this.authProvider.loginViaProvider(provider);
      this.navCtrl.setRoot(TabsPage);
    }
    catch (e) {
      console.log(`shit happens while logging in via ${provider}`, e);
      this.dialogUtilities.showToast(e.error || `Problem while signing in via ${provider}`);
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
