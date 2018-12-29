import { Component } from '@angular/core';
import { LoadingController, Events, ViewController, NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { BorrowerPickerPage } from '../../pages/borrower-picker/borrower-picker';
import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';
import { AccountEditorPage } from '../../pages/account-editor/account-editor';
import { AboutPage } from '../../pages/about/about';

@Component({
  selector: 'more-things-popup',
  templateUrl: 'more-things-popup.html'
})
export class MoreThingsPopupComponent {

  constructor(private navCtrl: NavController,
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private authProvider: AuthProvider,
    private events: Events,
    private dialogUtilities: DialogUtilitiesProvider) {
    console.log('Hello MoreThingsPopupComponent Component');
  }

  openBorrowerPicker() {
    this.navCtrl.push(BorrowerPickerPage, { stayWhenSelected: true });
    this.viewCtrl.dismiss();
  }

  openAccountEditor() {
    this.navCtrl.push(AccountEditorPage);
    this.viewCtrl.dismiss();
  }

  async logout() {
    let loading = this.loadingCtrl.create({
      content: "Logging out..."
    });
    loading.present();

    try {
      this.viewCtrl.dismiss();
      await this.authProvider.logout();
      this.events.publish("user:logout");
    }
    catch (e) {
      console.log("Problem logging out.", JSON.stringify(e));
      this.dialogUtilities.showToast("Hold on tight, there's an issue logging out.");
    }
    finally {
      loading.dismiss();
    }
  }

  openAboutPage() {
    this.navCtrl.push(AboutPage);
    this.viewCtrl.dismiss();
  }

  openEmail() {
    this.dialogUtilities.openEmail("adrian.onrails@gmail.com", "Utang Inamo feedback", "Anything?");
    this.viewCtrl.dismiss();
  }

}
