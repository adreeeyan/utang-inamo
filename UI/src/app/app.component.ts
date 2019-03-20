import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, IonicApp, IonicPage, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { fadeOutOnLeaveAnimation, bounceInUpOnEnterAnimation } from 'angular-animations';

import { SignInPage } from '../pages/sign-in/sign-in';
import { TabsPage } from '../pages/tabs/tabs';
import { Keyboard } from '@ionic-native/keyboard';
import { DialogUtilitiesProvider } from '../providers/dialog-utilities/dialog-utilities';
import { UtilitiesProvider } from '../providers/utilities/utilities';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { AuthProvider } from '../providers/auth/auth';

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

  // loading stuffs
  isLoadingShown: boolean = false;
  loadingDescription: string = "";

  constructor(private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private ionicApp: IonicApp,
    private keyboard: Keyboard,
    private events: Events,
    private dialogUtilities: DialogUtilitiesProvider,
    private utilities: UtilitiesProvider,
    private alertCtrl: AlertController,
    private authProvider: AuthProvider) {

    this.platform.ready().then(async () => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#077187");
      this.keyboard.setResizeMode("body");

      // Subscriptions
      this.events.subscribe("user:startsync", this.showLoading.bind(this));
      this.events.subscribe("user:endsync", this.hideLoading.bind(this));
      this.events.subscribe("util:showloading", this.showLoading.bind(this));
      this.events.subscribe("util:hideloading", this.hideLoading.bind(this));

      // For the PWA Install banner
      this.registerPWAInstallBanner();

      // Hide splash screen
      this.splashScreen.hide();

      // Authentication
      await this.validateAuthentication();

      // Register back button
      this.registerBackButtonHandler();
    });

  }

  async validateAuthentication() {
    // if this is web and the url is for public info
    // then just let it be
    if (this.utilities.isWeb() && document.URL.indexOf("public-debt-info") != -1) {
      // leave this place for the public debt info thingies
      return;
    }

    // Authentication
    const isLoggedIn = this.authProvider.isLoggedIn;
    if (!isLoggedIn) {
      this.nav.setRoot(SignInPage);
    }
  }

  showLoading(message = "I'm updating your data...") {
    this.loadingDescription = message;
    this.isLoadingShown = true;
  }

  hideLoading() {
    this.isLoadingShown = false;
  }

  private registerBackButtonHandler() {
    if (!this.utilities.isApp()) {
      // This is for PWA back button
      this.backButtonHandlerForPWA();
    } else {
      // Register back button for mobile app
      this.backButtonHandlerForCordova();
    }
  }

  private backButtonHandlerForCordova() {
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
          this.dialogUtilities.showToast("Press back again to exit the application.", timePeriodToExit);
          lastTimeBackPress = new Date().getTime();
        }
      }
    }, 0);
  }

  private backButtonHandlerForPWA() {
    // Taken from here: https://github.com/ionic-team/ionic/issues/13964#issuecomment-363453732
    // Still an issue in ionic
    window.onpopstate = (evt) => {
      // Close any active modals or overlays
      let activePortal = this.ionicApp._loadingPortal.getActive() ||
        this.ionicApp._modalPortal.getActive() ||
        this.ionicApp._overlayPortal.getActive();
      if (activePortal) {
        activePortal.dismiss();
        return;
      }
    }
  }

  private registerPWAInstallBanner() {
    // Code block
    if (this.utilities.isApp()) {
      return;
    }

    let deferredPrompt;

    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI notify the user they can add to home screen
      const confirm = this.alertCtrl.create({
        title: "Add to homescreen",
        message: "Do you agree to add UtangInamo to your homescreen? You can use the app without internet connection after you do this.",
        buttons: [
          {
            text: "Disagree",
            handler: () => {
              console.log("Disagree clicked");
            }
          },
          {
            text: "Agree",
            handler: () => {
              console.log("Agree clicked");
              // Show the prompt
              deferredPrompt.prompt();
              // Wait for the user to respond to the prompt
              deferredPrompt.userChoice
                .then((choiceResult) => {
                  if (choiceResult.outcome === "accepted") {
                    console.log("User accepted the A2HS prompt");
                  } else {
                    console.log("User dismissed the A2HS prompt");
                  }
                  deferredPrompt = null;
                });
            }
          }
        ]
      });
      confirm.present();
    });


  }
}