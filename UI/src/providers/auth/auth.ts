import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import { environment } from '../../environments/debug.environment';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DebtsProvider } from '../debts/debts';

@Injectable()
export class AuthProvider {

  private _fastHasCachedUser: boolean = false;
  fastIsLoggedIn: boolean = false; // use this after firebase check

  constructor(public http: HttpClient,
    private platform: Platform,
    private storage: Storage,
    private debtsProvider: DebtsProvider) {
    console.log('Hello AuthProvider Provider');
  }

  async hasCachedUser(): Promise<any> {
    try {
      const user = await this.storage.get("user");
      this._fastHasCachedUser = user != null;
      return Promise.resolve(this._fastHasCachedUser);
    }
    catch (e) {
      this._fastHasCachedUser = false;
      return Promise.reject(false);
    }
  }

  get fastHasCachedUser() {
    return this._fastHasCachedUser;
  }

  // googleLogin(): Promise<any> {

  //   try {
  //     if (this.platform.is("cordova")) {
  //       return this.nativeGoogleLogin();
  //     }
  //     else {
  //       return this.webGoogleLogin();
  //     }
  //   }
  //   catch (e) {
  //     return Promise.reject(e);
  //   }
  // }

  // private async nativeGoogleLogin(): Promise<any> {

  //   try {
  //     const gPlusResponse = await this.googlePlus.login({ "webClientId": environment.clientID, "offline": true });
  //     const googleCredential = firebase.auth.GoogleAuthProvider.credential(gPlusResponse.idToken);

  //     if (this.platform.is("core") || this.platform.is("mobileweb")) {
  //       return firebase.auth().signInWithCredential(googleCredential);
  //     }
  //     else {
  //       return firebase.auth().signInWithRedirect(googleCredential);
  //     }
  //   }
  //   catch (e) {
  //     return Promise.reject(e);
  //   }
  // }

  // private webGoogleLogin(): Promise<any> {
  //   try {
  //     const provider = new firebase.auth.GoogleAuthProvider();
  //     return this.angularFireAuth.auth.signInWithPopup(provider);
  //   }
  //   catch (e) {
  //     return Promise.reject(e);
  //   }
  // }

  // logout(): Promise<any> {
  //   return this.angularFireAuth.auth.signOut();
  // }

  login(username, password) {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");

    let credentials = {
      username: username,
      password: password
    };

    return this.http.post("http://localhost:3000/auth/login", credentials, { headers: headers }).toPromise();
  }

  register(username, email, password, confirmPassword) {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");

    let user = {
      name: username,
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    };

    return this.http.post("http://localhost:3000/auth/register", user, { headers: headers }).toPromise();
  }

}
