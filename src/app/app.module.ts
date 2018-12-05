import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';
import { DebtListingPageModule } from '../pages/debt-listing/debt-listing.module';
import { BorrowerEditorPageModule } from '../pages/borrower-editor/borrower-editor.module';
import { DashboardPageModule } from '../pages/dashboard/dashboard.module';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { DebtInfoPage } from '../pages/debt-info/debt-info';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { DebtEditorPage } from '../pages/debt-editor/debt-editor';
import { DebtListingPage } from '../pages/debt-listing/debt-listing';
import { TabsPage } from '../pages/tabs/tabs';
import { SignInPageModule } from '../pages/sign-in/sign-in.module';
import { AuthProvider } from '../providers/auth/auth';
import { environment } from '../environments/debug.environment';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, { pageTransition: "ios-transition" }, {
      links: [
        { component: DashboardPage, name: "dashboard", segment: "dashboard" },
        { component: DebtEditorPage, name: "debt-editor", segment: "debt-editor/:id", defaultHistory: [DebtListingPage] },
        { component: DebtInfoPage, name: "debt-info", segment: "debt-info/:id", defaultHistory: [DebtListingPage] },
        { component: DebtListingPage, name: "debt-list", segment: "debt-list" },
        { component: TabsPage, name: "tabs", segment: "tab" }
      ]
    }),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    DebtListingPageModule,
    BorrowerEditorPageModule,
    DashboardPageModule,
    TabsPageModule,
    SignInPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    HttpClientModule,
    GooglePlus,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider
  ]
})
export class AppModule { }
