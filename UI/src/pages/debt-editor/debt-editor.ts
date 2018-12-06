import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AmountEditorComponent } from '../../components/amount-editor/amount-editor';
import { BorrowerPickerPage } from '../borrower-picker/borrower-picker';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-debt-editor',
  templateUrl: 'debt-editor.html',
})
export class DebtEditorPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private authProvider: AuthProvider) {
  }

  ionViewCanEnter(): Promise<any> {
    return this.authProvider.hasCachedUser();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DebtEditorPage');
  }

  openAmountEditor() {
    let amountEditorModal = this.modalCtrl.create(AmountEditorComponent);
    amountEditorModal.present();
  }

  openBorrowerPicker() {
    let borrowerPickerModal = this.modalCtrl.create(BorrowerPickerPage);
    borrowerPickerModal.present();
  }

}
