import { Component, ViewChild } from '@angular/core';
import { IonicPage, Events, PopoverController, ModalController, NavController } from 'ionic-angular';
import { DebtsProvider } from '../../providers/debts/debts';
import { DebtType } from '../../models/debt';

import { MoreThingsPopupComponent } from '../../components/more-things-popup/more-things-popup';
import { DebtEditorPage } from '../debt-editor/debt-editor';
import { AccountEditorPage } from '../account-editor/account-editor';
import { ProfileProvider } from '../../providers/profile/profile';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  @ViewChild("imageFile")
  imageFile: any;

  user: any;
  totalPayables: any = 0;
  totalReceivables: any = 0;

  constructor(private debtsProvider: DebtsProvider,
    private profileProvider: ProfileProvider,
    private events: Events,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private dialogUtilities: DialogUtilitiesProvider,
    public sanitizer: DomSanitizer,
    private authProvider: AuthProvider) {

    this.events.subscribe("user:updated", this.refresh.bind(this));
  }

  ionViewCanEnter() {
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
    try {
      await this.refresh();
      console.log("Dashboard finished initializing...");
    }
    catch (e) {
      console.log("Shit happened while loading the dashboard", e);
    }
  }

  async refresh() {
    this.getUser();
    this.getTotalPayables();
    this.getTotalReceivables();
  }

  getUser() {
    this.profileProvider.getProfile().subscribe(user => this.user = user);
  }

  getTotalPayables() {
    this.debtsProvider.getUnpaidPayables().subscribe(unpaid => {
      const unpaidAmount = unpaid.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);
      this.totalPayables = unpaidAmount || 0;
    });
  }

  getTotalReceivables() {
    this.debtsProvider.getUnpaidReceivables().subscribe(unpaid => {
      const receivableAmount = unpaid.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);
      this.totalReceivables = receivableAmount || 0;
    });
  }

  pickImage() {
    this.imageFile.nativeElement.click();
  }

  changeImage(files) {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      try {
        this.dialogUtilities.showLoading("I'm updating your picture...");
        this.user.image = (await this.debtsProvider.resizedataURL(e.target.result, 150, 150)) as string;
        await this.profileProvider.updatePicture(this.user.image);
      }
      catch (e) {
        console.log("Error updating user picture", e);
        this.dialogUtilities.showToast("Something went wrong while updating your picture.");
      }
      finally {
        this.dialogUtilities.hideLoading();
      }
    };
    if (files.length > 0) {
      reader.readAsDataURL(files[0]);
    }
  }

  openPayablesPage() {
    this.events.publish("tab:selectPayables");
  }

  openReceivablesPage() {
    this.events.publish("tab:selectReceivables");
  }

  showPopupMore(evt) {
    let popover = this.popoverCtrl.create(MoreThingsPopupComponent);
    popover.present({
      ev: evt
    });
  }

  goToDebtEditor(debtType) {
    let debtEditorModal = this.modalCtrl.create(DebtEditorPage, { type: debtType });
    debtEditorModal.onDidDismiss(async () => {
      await this.refresh();
    });
    debtEditorModal.present();
  }

  addPayable() {
    this.goToDebtEditor(DebtType.PAYABLE);
  }

  addReceivable() {
    this.goToDebtEditor(DebtType.RECEIVABLE);
  }

  openAccountEditor() {
    this.navCtrl.push(AccountEditorPage);
  }
}
