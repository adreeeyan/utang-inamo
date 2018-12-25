import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Borrower } from '../../models/borrower';
import { DebtsProvider } from '../../providers/debts/debts';

import superlogin from 'superlogin-client';
import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';

@IonicPage()
@Component({
  selector: 'page-borrower-editor',
  templateUrl: 'borrower-editor.html',
})
export class BorrowerEditorPage {

  @ViewChild("imageFile")
  imageFile: any;

  borrower: Borrower;
  private isEdit: boolean = false;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private debtsProvider: DebtsProvider,
    private dialogUtilities: DialogUtilitiesProvider) {
  }

  ionViewCanEnter() {
    return superlogin.authenticated();
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad BorrowerEditorPage');
    const borrowerId = this.navParams.get("borrower");

    if (borrowerId) {
      // This is an edit
      this.isEdit = true;

      this.borrower = await this.getBorrower(borrowerId);
    } else {
      // This is a create
      this.isEdit = false;

      this.borrower = new Borrower({
        image: "assets/imgs/user-placeholder.jpg"
      });
    }
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

  pickImage() {
    this.imageFile.nativeElement.click();
  }

  changeImage(files) {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      this.borrower.image = (await this.debtsProvider.resizedataURL(e.target.result, 150, 150)) as string;
    };
    if (files.length > 0) {
      reader.readAsDataURL(files[0]);
    }
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
      const validationStatus = this.validateBorrower();
      if (validationStatus != BorrowerValidationStatus.VALID) {
        this.dialogUtilities.showToast(this.getValidationErrorString(validationStatus));
        return;
      }

      if (this.isEdit) {
        await this.debtsProvider.updateBorrower(this.borrower);
        this.dialogUtilities.showToast("Borrower successfully updated.");
      } else {
        await this.debtsProvider.createBorrower(this.borrower);
        this.dialogUtilities.showToast("Borrower successfully created");
      }
      this.navCtrl.pop();
    }
    catch (e) {
      console.log("Issue while creating borrower.", e);
    }
  }

  validateBorrower() {
    if (this.borrower.name.trim() == "") {
      return BorrowerValidationStatus.NONAME;
    }

    return BorrowerValidationStatus.VALID;
  }

  getValidationErrorString(status) {
    switch (status) {
      case BorrowerValidationStatus.NONAME: return "Give him/her a name, any name...";
    }
  }
}

enum BorrowerValidationStatus {
  VALID,
  NONAME
}
