import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { environment } from '../../environments/debug.environment';

@Injectable()
export class UtilitiesProvider {

  constructor(private platform: Platform) {
    console.log('Hello UtilitiesProvider Provider');
  }

  isApp() {
    return !this.platform.is("core") && !this.platform.is("mobileweb");
  }

  isWeb() {
    return this.platform.is("core") || this.platform.is("mobileweb");
  }

  createPublicDebtInfoUrl(userId, debtId) {
    return `${environment.webUrl}/#/public-debt-info/${userId}/${debtId}`;
  }

}
