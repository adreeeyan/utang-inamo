import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-borrower-editor',
  templateUrl: 'borrower-editor.html',
})
export class BorrowerEditorPage {

  image: string = "assets/imgs/user-placeholder.jpg";
  @ViewChild("imageFile")
  imageFile: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authProvider: AuthProvider) {
    // A hack from ionic: https://github.com/ionic-team/ionic/issues/13964#issuecomment-363453732
    const foo = { foo: true };
    history.pushState(foo, "anything", " "); // Put something to history for back button
  }

  ionViewCanEnter(): Promise<any> {
    return this.authProvider.hasCachedUser();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BorrowerEditorPage');
  }

  pickImage() {
    this.imageFile.nativeElement.click();
  }

  changeImage(files) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.image = e.target.result;
    };
    reader.readAsDataURL(files[0]);
  }

  get backgroundImage(){
    if(this.image != "assets/imgs/user-placeholder.jpg"){
      return 'url(' + this.image + ')';
    }else{
      return "";
    }
  }

  get backgroundInfo(){
    if(this.image != "assets/imgs/user-placeholder.jpg"){
      const options = {
        backgroundImage: `url(${this.image})`,
        filter: "blur(5px)"
      };
      return options;
    }else{
      return "";
    }
  }
}