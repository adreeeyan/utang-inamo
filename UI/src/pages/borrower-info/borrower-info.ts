import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController, AlertController, ViewController, NavController, Events } from 'ionic-angular';
import { DebtsProvider } from '../../providers/debts/debts';

import { Borrower } from '../../models/borrower';
import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';
import { BorrowerEditorPage } from '../borrower-editor/borrower-editor';
import { ContactsProvider } from '../../providers/contacts/contacts';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { SignInPage } from '../sign-in/sign-in';

@IonicPage()
@Component({
  selector: 'page-borrower-info',
  templateUrl: 'borrower-info.html',
})
export class BorrowerInfoPage {

  borrower: User;

  constructor(private modalCtrl: ModalController,
    private navParams: NavParams,
    private contactsProvider: ContactsProvider,
    private dialogUtilities: DialogUtilitiesProvider,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private events: Events,
    private authProvider: AuthProvider) {
  }

  ionViewCanEnter() {
    const isLoggedIn = this.authProvider.isLoggedIn;

    // redirect to sign in page if not logged in
    if(!isLoggedIn) {
      this.events.publish("user:logout");
    }

    return isLoggedIn;
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad BorrowerInfoPage');
    const borrowerId = this.navParams.get("borrower");
    this.getBorrower(borrowerId);
  }

  getBorrower(id) {
    try {
      this.contactsProvider.getContact(id).subscribe(borrower => this.borrower = borrower);
    }
    catch (e) {
      console.log("Issue while retrieving borrower.", e);
    }
  }

  openSkype() {
    this.dialogUtilities.openSkype(this.borrower.skypeId);
  }

  openSMS() {
    this.dialogUtilities.openSMS(this.borrower.cellNumber);
  }

  openMessenger() {
    this.dialogUtilities.openMessenger(this.borrower.messengerId);
  }

  openMap() {
    this.dialogUtilities.openMap(this.borrower.address);
  }

  openBorrowerEditor() {
    const borrower: any = this.borrower;
    const data = { borrower: borrower.id || borrower._id };
    let borrowerEditorModal = this.modalCtrl.create(BorrowerEditorPage, data);
    borrowerEditorModal.present();
  }

  delete() {
    this.alertCtrl.create({
      title: "Delete",
      message: "Are you sure you want to delete this contact?",
      buttons: [
        {
          text: "Cancel",
          handler: () => { }
        },
        {
          text: "Delete",
          handler: async () => {
            try {
              await this.contactsProvider.deleteContact(this.borrower);
              this.dialogUtilities.showToast("Contact successfully deleted.");
              this.viewCtrl.dismiss();
            } catch (e) {
              this.dialogUtilities.showToast("Error while deleting the contact.");
            }
          }
        }
      ]
    }).present();
  }

}
