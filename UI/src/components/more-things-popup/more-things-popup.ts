import { Component } from '@angular/core';
import { LoadingController, Events, ViewController, ModalController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { BorrowerPickerPage } from '../../pages/borrower-picker/borrower-picker';
import { BorrowerEditorPage } from '../../pages/borrower-editor/borrower-editor';
import { DialogUtilitiesProvider } from '../../providers/dialog-utilities/dialog-utilities';

@Component({
  selector: 'more-things-popup',
  templateUrl: 'more-things-popup.html'
})
export class MoreThingsPopupComponent {

  constructor(private modalCtrl: ModalController,
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private authProvider: AuthProvider,
    private events: Events,
    private dialogUtilities: DialogUtilitiesProvider) {
    console.log('Hello MoreThingsPopupComponent Component');
  }

  openBorrowerPicker() {
    try {
      const borrowerPickerModal = this.modalCtrl.create(BorrowerPickerPage);
      borrowerPickerModal.onDidDismiss(borrower => {
        if (borrower) {
          this.openBorrowerEditor(borrower);
        }
      });
      borrowerPickerModal.present();
    }
    catch {
      console.log("No borrower returned.");
    }
    finally {
      this.viewCtrl.dismiss();
    }
  }

  openBorrowerEditor(borrower) {
    let borrowerEditorModal = this.modalCtrl.create(BorrowerEditorPage, { borrower: borrower.id });
    borrowerEditorModal.present();
  }

  async logout() {
    let loading = this.loadingCtrl.create({
      content: "Logging out..."
    });
    loading.present();

    try {
      await this.authProvider.logout();
      this.events.publish("user:logout");
    }
    catch (e) {
      console.log("Problem logging out.", JSON.stringify(e));
      this.dialogUtilities.showToast("Hold on tight, there's an issue logging out.");
    }
    finally {
      loading.dismiss();
      this.viewCtrl.dismiss();
    }
  }

}
