import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, IonicApp, ToastController, IonicPage, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { fadeOutOnLeaveAnimation, bounceInUpOnEnterAnimation } from 'angular-animations';
import superlogin from 'superlogin-client';

import { SignInPage } from '../pages/sign-in/sign-in';
import { TabsPage } from '../pages/tabs/tabs';
import { DebtsProvider } from '../providers/debts/debts';
import { Keyboard } from '@ionic-native/keyboard';

@IonicPage()
@Component({
  templateUrl: 'app.html',
  animations: [
    bounceInUpOnEnterAnimation({ anchor: "enter", duration: 500, delay: 0 }),
    fadeOutOnLeaveAnimation({ anchor: "leave", duration: 500, delay: 0 })
  ]
})
export class MyApp {
  rootPage: any = TabsPage;
  @ViewChild(Nav) nav: Nav;
  overallPages: Array<any>;
  loadingState: LoadingState = LoadingState.NOTLOGGEDIN;

  constructor(private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private ionicApp: IonicApp,
    private toastCtrl: ToastController,
    private debtsProvider: DebtsProvider,
    private keyboard: Keyboard,
    private events: Events) {

    this.platform.ready().then(async () => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#077187");
      this.keyboard.setResizeMode("body");

      // Subscriptions
      this.events.subscribe("user:startsync", this.showStartSyncStatus.bind(this));
      this.events.subscribe("user:endsync", this.showEndSyncStatus.bind(this));

      // Authentication
      console.log("trying to authenticate");
      const session = superlogin.getSession();
      if (session) {
        // If there is a session then initiaze the shits
        this.debtsProvider.init(session);
        await this.debtsProvider.IsInitizialized();
        console.log("user authenticated", session);
      } else {
        console.log("user not authenticated");
        this.nav.setRoot(SignInPage);
      }

      if (this.platform.is("core") || this.platform.is("mobileweb")) {
        // This is for PWA back button
        this.backButtonListener();
      } else {
        // Register back button for mobile app
        this.registerBackButtonHandler();
      }

      this.splashScreen.hide();
    });

  }

  showStartSyncStatus() {
    this.loadingState = LoadingState.SYNCING;
  }

  showEndSyncStatus() {
    this.loadingState = LoadingState.SYNCINGCOMPLETE;
  }

  private get isSyncing() {
    return this.loadingState === LoadingState.SYNCING;
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
        this.ionicApp._toastPortal.getActive() ||
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
}

enum LoadingState {
  NOTLOGGEDIN,
  SYNCING,
  SYNCINGCOMPLETE
}