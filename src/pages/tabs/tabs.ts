import { Component, ViewChild } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { NavController, Tabs, NavParams } from 'ionic-angular';
import { DebtListingPage } from '../debt-listing/debt-listing';
import { DebtType } from '../../models/debt';

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = DebtListingPage;
  tab2Root = HomePage;
  tab3Root = DebtListingPage;

  tab1RootParams = { type: DebtType.PAYABLE };
  tab3RootParams = { type: DebtType.RECEIVABLE };

  selectedTab = 0;

  @ViewChild('theTabs') tabRef: Tabs;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToHomeTab() {
    this.tabRef.select(1);
  }
}
