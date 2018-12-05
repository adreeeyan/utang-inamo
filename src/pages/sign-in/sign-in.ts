import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth/auth';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private loadingCtrl: LoadingController,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
  }

  async googleLogin() {

    let loading = this.loadingCtrl.create({
      content: "Signing in via Google..."
    });

    try {
      loading.present();
      const response = await this.authProvider.googleLogin();

      // convert the image to base64
      const picture = await this.toDataURL(response.user.photoURL);

      // Save to storage
      await this.storage.set("user", {
        name: response.user.displayName,
        firstName: response.additionalUserInfo.profile.given_name,
        lastName: response.additionalUserInfo.profile.family_name,
        picture: picture
      });

      console.log("Successfully logged in.", response);

      this.goToHomePage();
    }
    catch (e) {
      console.log("Error logging in.", e);
    }
    finally {
      loading.dismiss();
    }
  }

  async logout() {
    await this.storage.remove("user");
    this.authProvider.logout();
  }

  goToHomePage() {
    this.navCtrl.setRoot(TabsPage);
  }

  toDataURL(url) {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        }
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });
  }
}
