import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'amount-editor',
  templateUrl: 'amount-editor.html'
})
export class AmountEditorComponent {

  constructor(public viewCtrl: ViewController) {
    console.log('Hello AmountEditorComponent Component');
    
    // A hack from ionic: https://github.com/ionic-team/ionic/issues/13964#issuecomment-363453732
    const foo = { foo: true };
    history.pushState(foo, "anything", " "); // Put something to history for back button
  }

  accept() {
    this.viewCtrl.dismiss();
  }

}
