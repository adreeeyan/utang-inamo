import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { AmountEditorComponent } from '../../components/amount-editor/amount-editor';
import { BorrowerPickerPage } from '../borrower-picker/borrower-picker';
import { DebtsProvider } from '../../providers/debts/debts';
import { Debt, DebtType } from '../../models/debt';

import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';
import { User, UserStatus } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-debt-editor',
  templateUrl: 'debt-editor.html',
})
export class DebtEditorPage {

  debt: Debt;
  private isEdit: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private debtsProvider: DebtsProvider,
    private dialogUtilities: DialogUtilitiesProvider,
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
    console.log('ionViewDidLoad DebtEditorPage');

    const debtId = this.navParams.get("id");
    const debtType = this.navParams.get("type");
    if (debtId) {
      // This is an edit
      this.isEdit = true;
      this.getDebt(debtId);
    } else {
      // This is a create
      this.isEdit = false;

      this.debt = new Debt({
        amount: 0,
        type: debtType
      });
    }
  }

  getDebt(id) {
    try {
      this.debtsProvider.getDebt(id).subscribe(debt => this.debt = debt);
    }
    catch (e) {
      console.log("Issue while retrieving debt.", e);
    }
  }

  get borrowerName() {
    if (!this.debt.borrower) {
      return "";
    }
    const borrower = this.debt.borrower as User;
    return borrower.name;
  }

  openAmountEditor() {
    try {
      const amountEditorModal = this.modalCtrl.create(AmountEditorComponent, { amount: this.debt.amount });
      amountEditorModal.onDidDismiss(amount => this.debt.amount = amount);
      amountEditorModal.present();
    }
    catch
    {
      console.log("No amount returned.");
    }
  }

  openBorrowerPicker() {
    try {
      const borrowerPickerModal = this.modalCtrl.create(BorrowerPickerPage);
      borrowerPickerModal.onDidDismiss(borrower => {
        if (borrower) {
          this.debt.borrower = borrower;
        }
      });
      borrowerPickerModal.present();
    }
    catch
    {
      console.log("No borrower returned.");
    }
  }

  async saveDebt() {
    try {
      const validationStatus = this.validateDebt();
      if (validationStatus != DebtValidationStatus.VALID) {
        this.dialogUtilities.showToast(this.getValidationErrorString(validationStatus));
        return;
      }

      if (this.isEdit) {
        await this.debtsProvider.updateDebt(this.debt);
        this.dialogUtilities.showToast("Debt successfully updated.");
      } else {
        await this.debtsProvider.createDebt(this.debt);
        this.dialogUtilities.showToast("Debt successfully created.");
      }
      this.navCtrl.pop();
    }
    catch (e) {
      console.log("Issue while creating debt.", e);
    }
  }

  get title() {
    if (this.debt.type == DebtType.PAYABLE) {
      return this.isEdit ? "Edit Payable" : "Add Payable";
    }
    return this.isEdit ? "Edit Receivable" : "Add Receivable";
  }

  validateDebt() {
    if (this.debt.amount == 0) {
      return DebtValidationStatus.ZEROAMOUNT;
    }

    if (this.debt.borrower == null) {
      return DebtValidationStatus.NOBORROWER;
    }

    if (this.debt.interest < 0) {
      return DebtValidationStatus.NEGATIVEINTEREST;
    }

    const borrower = this.debt.borrower as User;
    if (borrower.status == UserStatus.DELETED) {
      return DebtValidationStatus.DELETEDBORROWER;
    }

    return DebtValidationStatus.VALID;
  }

  getValidationErrorString(status) {
    switch (status) {
      case DebtValidationStatus.ZEROAMOUNT: return "Add an amount";
      case DebtValidationStatus.NOBORROWER:
        return this.debt.type == DebtType.PAYABLE ? "Who will you pay to?" : "Add a borrower";
      case DebtValidationStatus.DELETEDBORROWER: return "That contact is already deleted, please change it.";
      case DebtValidationStatus.NEGATIVEINTEREST: return "Negative interest is invalid...";
    }
  }
}

enum DebtValidationStatus {
  VALID,
  ZEROAMOUNT,
  NOBORROWER,
  DELETEDBORROWER,
  NEGATIVEINTEREST
}