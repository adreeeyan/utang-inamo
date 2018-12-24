import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Borrower } from '../../models/borrower';
import { DebtsProvider } from '../../providers/debts/debts';

import superlogin from 'superlogin-client';

@IonicPage()
@Component({
  selector: 'page-borrower-editor',
  templateUrl: 'borrower-editor.html',
})
export class BorrowerEditorPage {

  @ViewChild("imageFile")
  imageFile: any;

  borrower: Borrower;

  constructor(private navCtrl: NavController,
    private debtsProvider: DebtsProvider) {
  }

  ionViewCanEnter() {
    return superlogin.authenticated();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BorrowerEditorPage');
    this.borrower = new Borrower({
      address: "addresstest",
      cellNumber: "1111",
      firstName: "first1",
      lastName: "last1",
      messengerId: "rawr",
      skypeId: "rawr",
      image: "assets/imgs/user-placeholder.jpg"
    });
  }

  pickImage() {
    this.imageFile.nativeElement.click();
  }

  changeImage(files) {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      this.borrower.image = (await this.debtsProvider.resizedataURL(e.target.result, 150, 150)) as string;
    };
    reader.readAsDataURL(files[0]);
  }

  get backgroundImage() {
    if (this.borrower.image != "assets/imgs/user-placeholder.jpg") {
      return 'url(' + this.borrower.image + ')';
    } else {
      return "";
    }
  }

  get backgroundInfo() {
    if (this.borrower != null && this.borrower.image != "assets/imgs/user-placeholder.jpg") {
      const options = {
        backgroundImage: `url(${this.borrower.image})`,
        filter: "blur(5px)"
      };
      return options;
    } else {
      return "";
    }
  }

  async saveBorrower() {
    try {
      await this.debtsProvider.createBorrower(this.borrower);
      this.navCtrl.pop();
    }
    catch (e) {
      console.log("Issue while creating borrower.", e);
    }
  }
}
