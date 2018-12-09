import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, IonicApp, ToastController, IonicPage } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import superlogin from 'superlogin-client';

import { SignInPage } from '../pages/sign-in/sign-in';
import { TabsPage } from '../pages/tabs/tabs';
import { DebtsProvider } from '../providers/debts/debts';

@IonicPage()
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  @ViewChild(Nav) nav: Nav;
  overallPages: Array<any>;

  constructor(public platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private ionicApp: IonicApp,
    private toastCtrl: ToastController,
    private debtsProvider: DebtsProvider,
    private storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // Register back button
      this.registerBackButtonHandler();

      // This is for PWA back button
      this.backButtonListener();

      // Authentication
      const session = superlogin.getSession();
      if (session) {
        this.debtsProvider.init(session);
        console.log("user authenticated", session);
      } else {
        console.log("user not authenticated");
        this.nav.setRoot(SignInPage);
      }
    });

    // Save image
    this.registerProfileImageCache();
  }

  private registerBackButtonHandler() {
    // Taken from https://stackoverflow.com/a/44365055 and https://github.com/ionic-team/ionic/issues/6982#issuecomment-295896544
    // Back button handle
    // Registration of push in Android and Windows Phone
    var lastTimeBackPress = 0;
    var timePeriodToExit = 2000;

    this.platform.registerBackButtonAction(() => {
      let activePortal = this.ionicApp._loadingPortal.getActive() ||
        this.ionicApp._modalPortal.getActive() ||
        this.ionicApp._overlayPortal.getActive();

      //activePortal is the active overlay like a modal,toast,etc
      if (activePortal) {
        activePortal.dismiss();
        return;
      }

      let view = this.nav.getActive(); // As none of the above have occurred, its either a page pushed from menu or tab

      if (this.nav.canGoBack() || view && view.isOverlay) {
        this.nav.pop(); //pop if page can go back or if its an overlay over a menu page
      }
      else {
        // Double check to exit app
        if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
          this.platform.exitApp(); // Exit from app
        } else {
          let toast = this.toastCtrl.create({
            message: "Press back again to exit the application.",
            duration: timePeriodToExit,
            position: "bottom"
          });
          toast.present();
          lastTimeBackPress = new Date().getTime();
        }
      }
    }, 0);
  }

  private backButtonListener() {
    // Taken from here: https://github.com/ionic-team/ionic/issues/13964#issuecomment-363453732
    // Still an issue in ionic
    window.onpopstate = (evt) => {
      // Close any active modals or overlays
      let activePortal = this.ionicApp._loadingPortal.getActive() ||
        this.ionicApp._modalPortal.getActive() ||
        this.ionicApp._toastPortal.getActive() ||
        this.ionicApp._overlayPortal.getActive();
      if (activePortal) {
        activePortal.dismiss();
        return;
      }
    }
  }

  private registerProfileImageCache() {
    superlogin.authenticate().then(async (session) => {
      if (session.profile && session.profile.image) {
        const base64 = await this.toDataURL(session.profile.image);
        this.storage.set("image", base64);
      }
    });
  }

  private toDataURL(url) {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        }
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });
  }
}
