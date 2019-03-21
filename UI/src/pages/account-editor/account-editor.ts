import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { DebtsProvider } from '../../providers/debts/debts';
import { User } from '../../models/user';
import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';
import { ProfileProvider } from '../../providers/profile/profile';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-account-editor',
  templateUrl: 'account-editor.html',
})
export class AccountEditorPage {

  @ViewChild("imageFile")
  imageFile: any;
  imageData: any;

  user: User = new User();
  private hasChangedImage: boolean;

  constructor(private debtsProvider: DebtsProvider,
    private profileProvider: ProfileProvider,
    private dialogUtilities: DialogUtilitiesProvider,
    private navCtrl: NavController,
    private events: Events,
    private authProvider: AuthProvider,
    public sanitizer: DomSanitizer) {
  }

  async ionViewCanEnter() {
    const isLoggedIn = this.authProvider.isLoggedIn;

    // redirect to sign in page if not logged in
    if(!isLoggedIn) {
      this.events.publish("user:logout");
    }

    return isLoggedIn;
  }

  ionViewWillEnter() {
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter DashboardPage');
    this.profileProvider.getProfile().subscribe(user => {
      this.user = user;
      this.imageData = this.user.image;
    });
  }

  pickImage() {
    this.imageFile.nativeElement.click();
  }

  changeImage(files) {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      this.imageData = (await this.debtsProvider.resizedataURL(e.target.result, 150, 150)) as string;
      this.hasChangedImage = true;
    };
    if (files.length > 0) {
      reader.readAsDataURL(files[0]);
    }
  }

  async save() {
    try {
      this.dialogUtilities.showLoading("I'm updating your data...");
      if (this.hasChangedImage) {
        await this.profileProvider.updatePicture(this.imageData);
      }
      await this.profileProvider.updateProfile(this.user);
      this.dialogUtilities.showToast("Successfully updated your info.");
      this.events.publish("user:updated");
      this.navCtrl.pop();
    }
    catch (e) {
      console.log("Error updating user info", e);
      this.dialogUtilities.showToast("Something went wrong after updating your info.");
    }
    finally {
      this.dialogUtilities.hideLoading();
    }
  }
}
