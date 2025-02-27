import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { SignInPage } from '../sign-in/sign-in';
import { TabsPage } from '../tabs/tabs';
import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';
import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  user: User = new User();
  password: any = "";
  confirmPassword: any = "";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private loadingCtrl: LoadingController,
    private dialogUtilities: DialogUtilitiesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  async register() {
    // check if passwords are the same
    if(this.password !== this.confirmPassword) {
      this.dialogUtilities.showToast("Passwords are not the same.");
      return;
    }

    let loading = this.loadingCtrl.create({
      content: "Registering..."
    });
    loading.present();

    try {
      await this.authProvider.register(this.user, this.password);
      // this.debtsProvider.init(res);
      this.navCtrl.setRoot(TabsPage);
    }
    catch (e) {
      console.log("Problem encountered on registration.", e);
      this.dialogUtilities.showToast(this.concatValidationErrors(e) || "Cannot register, check your inputs and try again.");
    }
    finally {
      loading.dismiss();
    }
  }

  goToSignInPage() {
    this.navCtrl.setRoot(SignInPage);
  }

  concatValidationErrors(err) {
    if (!err.validationErrors) {
      return;
    }

    let validations = err.validationErrors;
    let errors = [];
    if (validations) {
      for (let key in validations) {
        errors = errors.concat(validations[key].flatMap(x => x));
      }
      return errors.join(".\n");
    }

    return;
  }

}
