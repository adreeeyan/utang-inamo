import { Component, ViewChild } from '@angular/core';

import { Tabs, IonicPage, Events, NavController } from 'ionic-angular';
import { DebtListingPage } from '../debt-listing/debt-listing';
import { DebtType } from '../../models/debt';
import { DashboardPage } from '../dashboard/dashboard';
import { SignInPage } from '../sign-in/sign-in';

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

  @ViewChild("theTabs") tabRef: Tabs;

  constructor(private events: Events,
    private navCtrl: NavController) {
    
  }

  ionViewDidLoad() {
    this.events.subscribe("user:logout", this.logout.bind(this));
    this.events.subscribe("tab:selectPayables", this.goToPayablesTab.bind(this));
    this.events.subscribe("tab:selectReceivables", this.goToReceivablesTab.bind(this));
  }

  ionViewDidLeave() {
    this.events.unsubscribe("user:logout");
    this.events.unsubscribe("tab:selectPayables");
    this.events.unsubscribe("tab:selectReceivables");
  }

  logout() {
    this.navCtrl.setRoot(SignInPage);
  }

  goToHomeTab() {
    this.tabRef.select(1);
  }

  goToPayablesTab() {
    this.tabRef.select(0);
  }

  goToReceivablesTab() {
    this.tabRef.select(2);
  }
}
