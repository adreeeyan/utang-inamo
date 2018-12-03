import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-borrower-editor',
  templateUrl: 'borrower-editor.html',
})
export class BorrowerEditorPage {

  image: string = "http://www.sunprairiebep.com/assets/img/profile-placeholder.gif";
  @ViewChild("imageFile")
  imageFile: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
    if(this.image != "http://www.sunprairiebep.com/assets/img/profile-placeholder.gif"){
      return 'url(' + this.image + ')';
    }else{
      return "";
    }
  }

  get backgroundInfo(){
    if(this.image != "http://www.sunprairiebep.com/assets/img/profile-placeholder.gif"){
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
