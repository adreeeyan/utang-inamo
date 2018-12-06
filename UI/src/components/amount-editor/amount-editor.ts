import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'amount-editor',
  templateUrl: 'amount-editor.html'
})
export class AmountEditorComponent {

  constructor(public viewCtrl: ViewController) {
    console.log('Hello AmountEditorComponent Component');
  }

  accept() {
    this.viewCtrl.dismiss();
  }

}
