import { Component } from '@angular/core';
import { IonicPage, ModalController, LoadingController, ViewController } from 'ionic-angular';
import { Borrower } from '../../models/borrower';
import { BorrowerEditorPage } from '../borrower-editor/borrower-editor';
import { DebtsProvider } from '../../providers/debts/debts';

import superlogin from 'superlogin-client';

@IonicPage()
@Component({
  selector: 'page-borrower-picker',
  templateUrl: 'borrower-picker.html',
})
export class BorrowerPickerPage {

  borrowers: Borrower[] = [];
  searchResults: Borrower[] = [];

  constructor(private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private debtsProvider: DebtsProvider) {
  }

  ionViewCanEnter() {
    return superlogin.authenticated();
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter BorrowerPickerPage');
    let loading = this.loadingCtrl.create();
    loading.present();
    await this.refresh();
    loading.dismiss();
  }

  async refresh() {
    this.borrowers = await this.getBorrowers();
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

  openBorrowerEditor() {
    let borrowerEditorModal = this.modalCtrl.create(BorrowerEditorPage);
    borrowerEditorModal.present();
  }

  select(borrower) {
    this.viewCtrl.dismiss(borrower);
  }

}
