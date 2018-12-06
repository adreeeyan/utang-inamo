import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Borrower } from '../../models/borrower';
import { DebtsProvider } from '../../providers/debts/debts';

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
    private navParams: NavParams,
    private authProvider: AuthProvider,
    private debtsProvider: DebtsProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
    // A hack from ionic: https://github.com/ionic-team/ionic/issues/13964#issuecomment-363453732
    const foo = { foo: true };
    history.pushState(foo, "anything", " "); // Put something to history for back button
  }

  // ionViewCanEnter(): Promise<any> {
  //   return this.authProvider.hasCachedUser();
  // }

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
    reader.onload = (e: any) => {
      this.borrower.image = e.target.result;
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
    let loading = this.loadingCtrl.create();
    loading.present();

    try {
      await this.debtsProvider.createBorrower(this.borrower);
      this.navCtrl.pop();
    }
    catch (e) {
      console.log("Issue while creating borrower.", e);
    }
    finally {
      loading.dismiss();
    }

  }
}
