import { Component } from '@angular/core';
import { IonicPage, ModalController, ViewController, NavParams } from 'ionic-angular';
import { Borrower } from '../../models/borrower';
import { BorrowerEditorPage } from '../borrower-editor/borrower-editor';
import { DebtsProvider } from '../../providers/debts/debts';

import superlogin from 'superlogin-client';
import { Contacts } from '@ionic-native/contacts';
import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';
import { UtilitiesProvider } from '../../providers/utilities/utilities';

@IonicPage()
@Component({
  selector: 'page-borrower-picker',
  templateUrl: 'borrower-picker.html',
})
export class BorrowerPickerPage {

  borrowers: Borrower[] = [];
  searchResults: Borrower[] = [];
  isFinishedInitializing: boolean = false;
  // for transitioning to borrower editor
  isForEdit: boolean = false;

  constructor(private navParams: NavParams,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private debtsProvider: DebtsProvider,
    private contacts: Contacts,
    private dialogUtilities: DialogUtilitiesProvider,
    private utilities: UtilitiesProvider) {
  }

  ionViewCanEnter() {
    return superlogin.authenticated();
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter BorrowerPickerPage');
    this.isForEdit = !!this.navParams.get("isForEdit");
    await this.refresh();
    this.isFinishedInitializing = true;
  }

  async refresh() {
    this.borrowers =  await this.getBorrowers();
    this.borrowers.sort((a, b) => a.name.localeCompare(b.name));
    this.searchResults = this.borrowers;
  }

  async doRefreshFromPull(refresher) {
    await this.refresh();
    refresher.complete();
  }

  async getBorrowers() {
    let borrowers = [];
    try {
      borrowers = await this.debtsProvider.getBorrowers();
    }
    catch (e) {
      console.log("Issue while retrieving borrowers.", e);
    }

    return borrowers;
  }

  search(ev: any) {
    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      this.searchResults = this.borrowers.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      this.searchResults = this.borrowers;
    }
  }

  openBorrowerEditor(borrower) {
    const data = borrower ? { borrower: borrower.id || borrower._id } : null;
    let borrowerEditorModal = this.modalCtrl.create(BorrowerEditorPage, data);
    borrowerEditorModal.present();
  }

  select(borrower) {
    this.viewCtrl.dismiss(borrower);
  }

  doClickEvent(borrower) {
    if (this.isForEdit) {
      this.openBorrowerEditor(borrower);
    } else {
      this.select(borrower);
    }
  }

  async openContactsPicker() {
    try {
      let contact: any = await this.contacts.pickContact();

      if (!contact._objectInstance) {
        throw "nothing found";
      }

      // address
      let address = contact.addresses && contact.addresses.length > 0 ? contact.addresses[0].formatted : "";
      // phone number
      let cellNumber = contact.phoneNumbers && contact.phoneNumbers.length > 0 ? contact.phoneNumbers[0].value : "";
      // skype
      let skype = "";
      let trySkype = contact.ims ? contact.ims.find(im => im.type.toLowerCase() == "skype") : null;
      skype = trySkype ? trySkype.value : "";
      // facebook
      let facebook = "";
      let tryFacebook = contact.ims ? contact.ims.find(im => im.type.toLowerCase() == "facebook" || im.type.toLowerCase() == "messenger") : null;
      facebook = tryFacebook ? tryFacebook.value : "";

      // get the relevant data
      const borrower = new Borrower({
        firstName: contact.name.givenName,
        lastName: contact.name.familyName,
        address: address,
        cellNumber: cellNumber,
        image: "assets/imgs/user-placeholder.jpg",
        skypeId: skype,
        messengerId: facebook
      });

      await this.debtsProvider.createBorrower(borrower);
      setTimeout(() => {
        this.refresh();
      }, 500);

      this.dialogUtilities.showToast("Borrower successfully created");
    }
    catch (e) {
      console.log("There was an issue in picking the contact", JSON.stringify(e));
    }
  }

  get isApp() {
    return this.utilities.isApp();
  }
}
