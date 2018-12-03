import { Component, ViewChild } from '@angular/core';

import { NavController, Tabs, NavParams, App } from 'ionic-angular';
import { DebtListingPage } from '../debt-listing/debt-listing';
import { DebtType } from '../../models/debt';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = DebtListingPage;
  tab2Root = DashboardPage;
  tab3Root = DebtListingPage;

  tab1RootParams = { type: DebtType.PAYABLE };
  tab3RootParams = { type: DebtType.RECEIVABLE };

  selectedTab = 1;
  isHomeTabShown = true;

  @ViewChild('theTabs') tabRef: Tabs;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App) {

    this.app.viewWillEnter.subscribe(viewCtrl => {
      // Hide the home tab if current view is neither of these
      this.isHomeTabShown = viewCtrl.instance instanceof DebtListingPage || viewCtrl.instance instanceof DashboardPage;
   });
  }

  goToHomeTab() {
    this.tabRef.select(1);
  }
}
