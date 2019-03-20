import { Injectable } from '@angular/core';
import { ToastController, Events } from 'ionic-angular';
import { UtilitiesProvider } from '../utilities/utilities';
import { DebtType, DebtStatus } from '../../models/debt';
import { FormatCurrencyPipe } from '../../pipes/format-currency/format-currency';

@Injectable()
export class DialogUtilitiesProvider {

  constructor(private toastCtrl: ToastController,
    private utilities: UtilitiesProvider,
    private events: Events,
    private formatCurrencyPipe: FormatCurrencyPipe) {
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
    window.open(`sms:${cellNumber};?&body=${message}`, "_system");
  }

  openMessenger(messengerId) {
    window.open(`https://m.me/${messengerId}`, "_system");
  }

  openGenericLink(link) {
    window.open(link, "_system");
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

  openEmail(address, subject = "", body = "") {
    window.open(`mailto:${address}?subject=${subject}&body=${body}`, "_system");
  }

  showLoading(message = "") {
    this.events.publish("util:showloading", message);
  }

  hideLoading() {
    this.events.publish("util:hideloading");
  }

  async createSMSMessage(debt) {
    let message = "";
    const debtUrl = await this.utilities.createPublicDebtInfoUrl(debt.id || debt._id);
    if (debt.type == DebtType.RECEIVABLE && debt.status == DebtStatus.UNPAID) {
      message = `Hi ${debt.borrower.singleName},\r\n\r\nI would like to follow up your debt amounting to ${this.formatCurrencyPipe.transform(debt.total)}.\r\n\r\n` +
        `You can find the info here:\r\n${debtUrl}`;
    } else if (debt.type == DebtType.RECEIVABLE && debt.status == DebtStatus.PAID) {
      message = `Hi ${debt.borrower.singleName},\r\n\r\nThank you for paying your debt.\r\n\r\n` +
        `You can find the info here:\r\n${debtUrl}`;
    } else if (debt.type == DebtType.PAYABLE && debt.status == DebtStatus.UNPAID) {
      message = `Hi ${debt.borrower.singleName},\r\n\r\nI have recorded the money I borrowed from you. Thank you.\r\n\r\n` +
        `You can find the info here:\r\n${debtUrl}`;
    } else if (debt.type == DebtType.RECEIVABLE && debt.status == DebtStatus.PAID) {
      message = `Hi ${debt.borrower.singleName},\r\n\r\nThank you for lending me.\r\n\r\n` +
        `You can find the info here:\r\n${debtUrl}`;
    }
    return message;
  }

}
