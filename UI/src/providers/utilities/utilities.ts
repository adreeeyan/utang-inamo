import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { environment } from '../../environments/debug.environment';
import { ProfileProvider } from '../profile/profile';
import { resolve } from 'url';

@Injectable()
export class UtilitiesProvider {

  constructor(private platform: Platform,
    private profileProvider: ProfileProvider) {
    console.log('Hello UtilitiesProvider Provider');
  }

  isApp() {
    return !this.platform.is("core") && !this.platform.is("mobileweb");
  }

  isWeb() {
    return this.platform.is("core") || this.platform.is("mobileweb");
  }

  createPublicDebtInfoUrl(debtId) {
    return new Promise(resolve => {
      this.profileProvider.getProfile().subscribe(user => {
        resolve(`${environment.webUrl}/#/public-debt-info/${user.id}/${debtId}`);
      });
    });
  }

}
