import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController, ViewController } from 'ionic-angular';
import { Borrower } from '../../models/borrower';
import { BorrowerEditorPage } from '../borrower-editor/borrower-editor';
import { AuthProvider } from '../../providers/auth/auth';
import { DebtsProvider } from '../../providers/debts/debts';

@IonicPage()
@Component({
  selector: 'page-borrower-picker',
  templateUrl: 'borrower-picker.html',
})
export class BorrowerPickerPage {

  borrowers: Borrower[] = [];
  searchResults: Borrower[] = [];

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private authProvider: AuthProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private debtsProvider: DebtsProvider) {
    // A hack from ionic: https://github.com/ionic-team/ionic/issues/13964#issuecomment-363453732
    const foo = { foo: true };
    history.pushState(foo, "anything", " "); // Put something to history for back button
  }

  // ionViewCanEnter(): Promise<any> {
  //   return this.authProvider.hasCachedUser();
  // }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter BorrowerPickerPage');
    this.borrowers = await this.getBorrowers();
    this.searchResults = this.borrowers;
  }

  async getBorrowers() {
    let loading = this.loadingCtrl.create();
    loading.present();

    let borrowers = [];
    try {
      borrowers = await this.debtsProvider.getBorrowers();
    }
    catch (e) {
      console.log("Issue while retrieving borrowers.", e);
    }
    finally {
      loading.dismiss();
    }

    return borrowers;

    // let borrowers = [];
    // for (let x = 0; x < 20; x++) {
    //   borrowers.push(new Borrower({
    //     id: `${x}`,
    //     firstName: "John",
    //     middleName: `${x}`,
    //     lastName: "Doe",
    //   }));
    // }
    // return borrowers;
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
