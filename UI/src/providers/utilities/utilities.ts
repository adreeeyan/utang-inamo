import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { environment } from '../../environments/debug.environment';
import superlogin from 'superlogin-client';

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

  createPublicDebtInfoUrl(debtId) {
    let session: any = superlogin.getSession();
    return `${environment.webUrl}/#/public-debt-info/${session.user_id}/${debtId}`;
  }

}
