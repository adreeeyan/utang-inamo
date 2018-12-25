import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class DialogUtilitiesProvider {

  constructor(private toastCtrl: ToastController) {
    console.log('Hello DialogUtilitiesProvider Provider');
  }

  showToast(message, duration = 3000) {
    this.toastCtrl.create({
      message: message,
      duration: duration,
      showCloseButton: true
    }).present();
  }

}
