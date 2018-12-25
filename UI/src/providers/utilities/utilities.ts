import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class UtilitiesProvider {

  constructor(private platform: Platform) {
    console.log('Hello UtilitiesProvider Provider');
  }

  isApp() {
    return !this.platform.is("core") && !this.platform.is("mobileweb");
  }

}
