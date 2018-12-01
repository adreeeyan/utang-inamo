import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DebtEditorPage } from '../debt-editor/debt-editor';
import { Debt } from '../../models/debt';

@IonicPage()
@Component({
  selector: 'page-debt-info',
  templateUrl: 'debt-info.html',
})
export class DebtInfoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DebtInfoPage');
  }

  goToDebtEditor(debt: Debt){
    this.navCtrl.push(DebtEditorPage, debt);
  }

}
