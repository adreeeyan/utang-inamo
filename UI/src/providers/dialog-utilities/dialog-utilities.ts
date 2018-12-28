import { Injectable } from '@angular/core';
import { ToastController, Platform, Events } from 'ionic-angular';
import { UtilitiesProvider } from '../utilities/utilities';

@Injectable()
export class DialogUtilitiesProvider {

  constructor(private toastCtrl: ToastController,
    private utilities: UtilitiesProvider,
    private platform: Platform,
    private events: Events) {
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

  openSMS(cellNumber, message = "") {
    message = encodeURIComponent(message);
    if (this.platform.is("ios")) {
      window.open(`sms:${cellNumber}&body=${message}`, "_system");
    } else {
      window.open(`sms:${cellNumber}?body=${message}`, "_system");
    }
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

  showLoading() {
    this.events.publish("util:showloading");
  }

  hideLoading() {
    this.events.publish("util:hideloading");
  }

}
