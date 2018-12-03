import { Component, ViewChild } from '@angular/core';

import { HomePage } from '../home/home';
import { NavController, Tabs, NavParams, App } from 'ionic-angular';
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
  isHomeTabShown = true;

  @ViewChild('theTabs') tabRef: Tabs;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App) {

    this.app.viewWillEnter.subscribe(viewCtrl => {
      // Hide the home tab if current view is neither of these
      const tabsList = ["DebtListingPage", "HomePage", "DebtListingPage"];
      const currentView = viewCtrl.instance.constructor.name;
      this.isHomeTabShown = tabsList.indexOf(currentView) != -1;
   })
  }

  goToHomeTab() {
    this.tabRef.select(1);
  }
}