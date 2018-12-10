import { Component, ViewChild } from '@angular/core';

import { Tabs, IonicPage } from 'ionic-angular';
import { DebtListingPage } from '../debt-listing/debt-listing';
import { DebtType } from '../../models/debt';
import { DashboardPage } from '../dashboard/dashboard';

@IonicPage()
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

  @ViewChild('theTabs') tabRef: Tabs;

  constructor() {
  }

  goToHomeTab() {
    this.tabRef.select(1);
  }
}
