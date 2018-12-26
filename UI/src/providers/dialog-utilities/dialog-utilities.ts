import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { UtilitiesProvider } from '../utilities/utilities';

@Injectable()
export class DialogUtilitiesProvider {

  constructor(private toastCtrl: ToastController,
    private utilities: UtilitiesProvider) {
    console.log('Hello DialogUtilitiesProvider Provider');
  }

  showToast(message, duration = 3000) {
    this.toastCtrl.create({
      message: message,
      duration: duration,
      showCloseButton: true
    }).present();
  }

  openSkype(skypeId) {
    window.open(`skype:${skypeId}?chat`, "_system");
  }

  openSMS(cellNumber) {
    window.open(`sms://${cellNumber}`, "_system");
  }

  openMessenger(messengerId) {
    window.open(`https://m.me/${messengerId}`, "_system");
  }

  openMap(location) {
    if (this.utilities.isApp()) {
      location = location.replace(/ /g, "+");
      window.open(`geo:0,0?q=${location}`, "_system");
    } else {
      location = location.replace(/ /g, "%20");
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${location}`, "_system");
    }
  }

}
