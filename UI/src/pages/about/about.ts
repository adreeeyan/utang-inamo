import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { environment } from '../../environments/debug.environment';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  version: string;

  constructor() {
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LnAbout");
    this.version = environment.appVersion;
  }

  openInBrowser(evt, url) {
    window.open(url, "_system", "location=yes");
    evt.preventDefault();
    return false;
  }

}
