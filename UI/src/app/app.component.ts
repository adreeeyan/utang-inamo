import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, IonicApp, ToastController, IonicPage, App, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SignInPage } from '../pages/sign-in/sign-in';
import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../providers/auth/auth';

@IonicPage()
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = SignInPage;
  @ViewChild(Nav) nav: Nav;
  overallPages: Array<any>;

  constructor(public platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private app: App,
    private ionicApp: IonicApp,
    private toastCtrl: ToastController,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private authProvider: AuthProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // Register back button
      this.registerBackButtonHandler();

      // This is for PWA back button
      this.backButtonListener();
    });

    // let loading = this.loadingCtrl.create({
    //   content: "Checking for signed in user..."
    // });

    // loading.present();

    // Authentication
    // this.angularFireAuth.auth.onAuthStateChanged(user => {
    //   this.authProvider.fastIsLoggedIn = user != null;

    //   // also check if there is a user data in the storage
    //   this.storage.get("user").then(responseUser => {
    //     if (user && (responseUser != null)) {
    //       console.log("signed in");
    //       loading.dismiss();
    //     } else {
    //       loading.dismiss();

    //       // check if local usage
    //       if (responseUser && responseUser.isLocal) {
    //         console.log("signed in locally");
    //       } else {
    //         console.log("not signed in");
    //         this.app.getActiveNav().setRoot(SignInPage);
    //       }
    //     }
    //   });
    // });
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
}
