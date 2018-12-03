import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DebtListingPageModule } from '../pages/debt-listing/debt-listing.module';
import { BorrowerEditorPageModule } from '../pages/borrower-editor/borrower-editor.module';
import { DashboardPageModule } from '../pages/dashboard/dashboard.module';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { DebtInfoPage } from '../pages/debt-info/debt-info';
import { BorrowerEditorPage } from '../pages/borrower-editor/borrower-editor';
import { BorrowerPickerPage } from '../pages/borrower-picker/borrower-picker';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { DebtEditorPage } from '../pages/debt-editor/debt-editor';
import { DebtListingPage } from '../pages/debt-listing/debt-listing';
import { TabsPage } from '../pages/tabs/tabs';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, { pageTransition: "ios-transition" }, {
      links: [
        { component: DashboardPage, name: "dashboard", segment: "dashboard" },
        { component: DebtEditorPage, name: "debt-editor", segment: "debt-editor/:id", defaultHistory: [DebtListingPage] },
        { component: DebtInfoPage, name: "debt-info", segment: "debt-info/:id", defaultHistory: [DebtListingPage] },
        { component: DebtListingPage, name: "debt-list", segment: "debt-list" },
        { component: TabsPage, name: "tabs", segment: "tab" }
      ]
    }),
    DebtListingPageModule,
    BorrowerEditorPageModule,
    DashboardPageModule,
    TabsPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
