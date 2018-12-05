import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  user: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private authProvider: AuthProvider) {
  }

  async ionViewCanEnter() {
    return await this.authProvider.isAuthenticated();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');

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
  }

  openPayablesPage() {
    this.navCtrl.parent.select(0);
  }

  openReceivablesPage() {
    this.navCtrl.parent.select(2);
  }

  logout() {
    this.authProvider.logout();
  }

}
