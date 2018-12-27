import { Component } from '@angular/core';
import { IonicPage, ModalController, ViewController, NavParams, AlertController } from 'ionic-angular';
import { Borrower } from '../../models/borrower';
import { DebtsProvider } from '../../providers/debts/debts';

import superlogin from 'superlogin-client';
import { Contacts } from '@ionic-native/contacts';
import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { BorrowerInfoPage } from '../borrower-info/borrower-info';
import _ from "lodash";
import { BorrowerEditorPage } from '../borrower-editor/borrower-editor';

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
  stayWhenSelected: boolean = false;

  // for multi-selection
  multiSelectionEnabled = false;
  selectedBorrowers: Borrower[] = [];

  constructor(private navParams: NavParams,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private debtsProvider: DebtsProvider,
    private contacts: Contacts,
    private dialogUtilities: DialogUtilitiesProvider,
    private utilities: UtilitiesProvider,
    private alertCtrl: AlertController) {
  }

  ionViewCanEnter() {
    return superlogin.authenticated();
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter BorrowerPickerPage');
    this.stayWhenSelected = !!this.navParams.get("stayWhenSelected");
    await this.refresh();
    this.isFinishedInitializing = true;
  }

  async refresh() {
    this.borrowers = await this.getBorrowers();
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

  openBorrowerInfo(borrower) {
    const data = borrower ? { borrower: borrower.id || borrower._id } : null;
    let borrowerInfoModal = this.modalCtrl.create(BorrowerInfoPage, data);
    borrowerInfoModal.present();
  }

  async openBorrowerEditor(borrower) {
    try {
      const data = borrower ? { borrower: borrower.id || borrower._id } : null;
      let borrowerEditorModal = this.modalCtrl.create(BorrowerEditorPage, data);
      borrowerEditorModal.onDidDismiss(async () => {
        await this.refresh();
      });
      borrowerEditorModal.present();
    }
    catch (e) {
      console.log("There was an issue after opening borrower editor", e);
    }
  }

  select(borrower) {
    this.viewCtrl.dismiss(borrower);
  }

  enableMultiSelection() {
    this.multiSelectionEnabled = true;
  }

  disableMultiSelection() {
    this.multiSelectionEnabled = false;
    this.selectedBorrowers = [];
  }

  doClickEvent(borrower, evt) {

    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
    }

    // if multiselection is enabled
    // then just do the toggling
    if (this.multiSelectionEnabled) {
      this.toggleSelection(borrower);
      // if no selected items anymore then disable multiselection
      if (this.selectedBorrowers.length == 0) {
        this.disableMultiSelection();
      }
      return;
    }

    // open borrower info if from contacts page
    if (this.stayWhenSelected) {
      this.openBorrowerInfo(borrower);
    } else {
      this.select(borrower);
    }
  }

  toggleSelection(borrower: Borrower) {
    // check if borrower if list
    // if in list then remove it
    const hasItem = this.isInList(borrower);
    if (hasItem) {
      _.pull(this.selectedBorrowers, borrower);
    } else {
      this.selectedBorrowers.push(borrower);
    }
  }

  isInList(borrower: Borrower) {
    return _.includes(this.selectedBorrowers, borrower);
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

  delete() {
    this.alertCtrl.create({
      title: "Delete",
      message: "Are you sure you want to delete the selected contacts?",
      buttons: [
        {
          text: "Cancel",
          handler: () => { }
        },
        {
          text: "Delete",
          handler: async () => {
            try {
              // iterate the contacts
              for (const borrower of this.selectedBorrowers) {
                // delete it
                await this.debtsProvider.deleteBorrower(borrower);
              }
              // refresh the list
              setTimeout(async () => {
                await this.refresh();
              }, 500);
              this.dialogUtilities.showToast("Contacts successfully deleted.");
            }
            catch (e) {
              this.dialogUtilities.showToast("Error while deleting the contacts.");
            }
            finally {
              // disable the multi selection
              this.disableMultiSelection();
            }
          }
        }
      ]
    }).present();
  }
}
