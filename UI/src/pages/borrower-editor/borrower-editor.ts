import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DebtsProvider } from '../../providers/debts/debts';

import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';
import { ContactsProvider } from '../../providers/contacts/contacts';
import { User } from '../../models/user';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-borrower-editor',
  templateUrl: 'borrower-editor.html',
})
export class BorrowerEditorPage {

  @ViewChild("imageFile")
  imageFile: any;
  imageData: any;

  borrower: User;
  private isEdit: boolean = false;
  private hasChangedImage: boolean;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private debtsProvider: DebtsProvider,
    private contactsProvider: ContactsProvider,
    private dialogUtilities: DialogUtilitiesProvider,
    private authProvider: AuthProvider,
    private events: Events,
    public sanitizer: DomSanitizer) {
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
    console.log('ionViewDidLoad BorrowerEditorPage');
    const borrowerId = this.navParams.get("borrower");

    if (borrowerId) {
      // This is an edit
      this.isEdit = true;
      this.getBorrower(borrowerId);
    } else {
      // This is a create
      this.isEdit = false;

      this.borrower = new User({
        image: "assets/imgs/user-placeholder.jpg"
      });
      this.imageData = this.borrower.image;
    }
  }

  getBorrower(id) {
    try {
      // not subscription because we don't it to update always
      const sub$ = this.contactsProvider.getContact(id).subscribe(borrower => {
        this.borrower = borrower;
        this.imageData = this.borrower.image;
        sub$.unsubscribe();
      });
    }
    catch (e) {
      console.log("Issue while retrieving borrower.", e);
    }
  }

  pickImage() {
    this.imageFile.nativeElement.click();
  }

  changeImage(files) {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      this.imageData = (await this.debtsProvider.resizedataURL(e.target.result, 150, 150)) as string;
      this.hasChangedImage = true;
    };
    if (files.length > 0) {
      reader.readAsDataURL(files[0]);
    }
  }

  async saveBorrower() {
    try {
      this.dialogUtilities.showLoading("Hold my beer...");
      const validationStatus = this.validateBorrower();
      if (validationStatus != BorrowerValidationStatus.VALID) {
        this.dialogUtilities.showToast(this.getValidationErrorString(validationStatus));
        return;
      }

      // add or update
      if (this.isEdit) {
        await this.contactsProvider.updateContact(this.borrower);
      } else {
        this.borrower.id = await this.contactsProvider.createContact(this.borrower);
      }

      // update image
      if (this.hasChangedImage) {
        await this.contactsProvider.updatePicture(this.borrower, this.imageData);
      }

      // show toast
      if (this.isEdit) {
        this.dialogUtilities.showToast("Borrower successfully updated.");
      } else {
        this.dialogUtilities.showToast("Borrower successfully created");
      }
      this.navCtrl.pop();
    }
    catch (e) {
      console.log("Issue while creating borrower.", e);
    }
    finally {
      this.dialogUtilities.hideLoading();
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
