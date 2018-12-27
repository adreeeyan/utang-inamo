import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController, AlertController, ViewController } from 'ionic-angular';
import { DebtsProvider } from '../../providers/debts/debts';

import superlogin from 'superlogin-client';
import { Borrower } from '../../models/borrower';
import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';
import { BorrowerEditorPage } from '../borrower-editor/borrower-editor';

@IonicPage()
@Component({
  selector: 'page-borrower-info',
  templateUrl: 'borrower-info.html',
})
export class BorrowerInfoPage {

  borrower: Borrower;

  constructor(private modalCtrl: ModalController,
    private navParams: NavParams,
    private debtsProvider: DebtsProvider,
    private dialogUtilities: DialogUtilitiesProvider,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController) {
  }

  ionViewCanEnter() {
    return superlogin.authenticated();
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad BorrowerInfoPage');
    const borrowerId = this.navParams.get("borrower");
    this.borrower = await this.getBorrower(borrowerId);
  }

  async getBorrower(id) {
    let borrower = null;
    try {
      borrower = await this.debtsProvider.getBorrower(id);
    }
    catch (e) {
      console.log("Issue while retrieving borrower.", e);
    }

    return Promise.resolve(borrower);
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
              await this.debtsProvider.deleteBorrower(this.borrower);
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
