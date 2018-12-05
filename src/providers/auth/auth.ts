import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from '../../environments/debug.environment';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthProvider {

  constructor(public http: HttpClient,
    private angularFireAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    private platform: Platform,
    private storage: Storage) {
    console.log('Hello AuthProvider Provider');
  }

  async isAuthenticated(): Promise<any> {
    try
    {
      const user = await this.storage.get("user");
      return Promise.resolve(user != null);
    }
    catch(e)
    {
      return Promise.reject(false);
    }
  }

  googleLogin(): Promise<any> {

    try {
      if (this.platform.is("cordova")) {
        return this.nativeGoogleLogin();
      }
      else {
        return this.webGoogleLogin();
      }
    }
    catch (e) {
      return Promise.reject(e);
    }
  }

  private async nativeGoogleLogin(): Promise<any> {

    try {
      const gPlusResponse = await this.googlePlus.login({ "webClientId": environment.clientID, "offline": true });
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(gPlusResponse.idToken);

      if (this.platform.is("core") || this.platform.is("mobileweb")) {
        return firebase.auth().signInWithCredential(googleCredential);
      }
      else {
        return firebase.auth().signInWithRedirect(googleCredential);
      }
    }
    catch (e) {
      return Promise.reject(e);
    }
  }

  private webGoogleLogin(): Promise<any> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      return this.angularFireAuth.auth.signInWithPopup(provider);
    }
    catch (e) {
      return Promise.reject(e);
    }
  }

  logout(): Promise<any> {
    return this.angularFireAuth.auth.signOut();
  }

}
