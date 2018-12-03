import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Borrower } from '../../models/borrower';

@IonicPage()
@Component({
  selector: 'page-borrower-picker',
  templateUrl: 'borrower-picker.html',
})
export class BorrowerPickerPage {

  borrowers: Borrower[] = [];
  searchResults: Borrower[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BorrowerPickerPage');
    this.borrowers = this.getBorrowers();
    this.searchResults = this.borrowers;
  }

  getBorrowers() {
    let borrowers = [];
    for (let x = 0; x < 20; x++) {
      borrowers.push(new Borrower({
        id: `${x}`,
        firstName: "John",
        middleName: `${x}`,
        lastName: "Doe",
      }));
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

  dismiss() {
    this.navCtrl.pop();
  }

}
