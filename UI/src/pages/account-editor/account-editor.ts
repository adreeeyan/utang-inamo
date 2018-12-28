import { Component, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { DebtsProvider } from '../../providers/debts/debts';
import { AuthProvider } from '../../providers/auth/auth';

import superlogin from 'superlogin-client';
import { User } from '../../models/user';
import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';

@IonicPage()
@Component({
  selector: 'page-account-editor',
  templateUrl: 'account-editor.html',
})
export class AccountEditorPage {

  @ViewChild("imageFile")
  imageFile: any;

  user: User = new User();

  constructor(private debtsProvider: DebtsProvider,
    private authProvider: AuthProvider,
    private dialogUtilities: DialogUtilitiesProvider) {
  }

  ionViewCanEnter() {
    return superlogin.authenticated();
  }

  ionViewWillEnter() {
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter DashboardPage');
    try {
      await this.refresh();
      console.log("Dashboard finished initializing...");
    }
    catch (e) {
      console.log("Shit happened while loading the dashboard", e);
    }
  }

  async refresh() {
    this.user = await this.authProvider.getInfo();
  }

  pickImage() {
    this.imageFile.nativeElement.click();
  }

  changeImage(files) {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      this.user.image = (await this.debtsProvider.resizedataURL(e.target.result, 150, 150)) as string;
    };
    if (files.length > 0) {
      reader.readAsDataURL(files[0]);
    }
  }

  async save() {
    try {
      this.dialogUtilities.showLoading();
      await this.authProvider.updateUserPicture(this.user.id, this.user.image);
      await this.authProvider.updateUser(this.user);
      this.dialogUtilities.showToast("Successfully updated your info.");
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
