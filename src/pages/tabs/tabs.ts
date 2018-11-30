import { Component, ViewChild } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { NavController, Tabs } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = AboutPage;
  tab2Root = HomePage;
  tab3Root = ContactPage;

  selectedTab = 1;

  @ViewChild('theTabs') tabRef: Tabs;

  constructor(public navCtrl: NavController) {

  }

  goToHomeTab(){
    this.tabRef.select(1);
  }
}
