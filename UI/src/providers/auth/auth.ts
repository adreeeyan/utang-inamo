import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus';
import { UtilitiesProvider } from '../utilities/utilities';
import { User } from '../../models/user';
import { ProfileProvider } from '../profile/profile';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthProvider {

  isLoggedIn: boolean;

  constructor(private fireAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    private utilities: UtilitiesProvider,
    private profileProvider: ProfileProvider) {
    console.log('Hello AuthProvider Provider');

    this.fireAuth.auth.onAuthStateChanged(user => {
      this.isLoggedIn = !!user;
    });
  }

  register(user: User, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.fireAuth.auth.createUserWithEmailAndPassword(user.email, password);

        // set the name of newly created user to the jwt
        response.user.updateProfile({
          displayName: user.name,
          photoURL: ""
        });

        // add the profile info to the database
        await this.profileProvider.updateProfile(user);

        console.log("Registration successful");
        // resolve the response
        resolve(response.user);
      } catch (e) {
        console.log("Registration failed", e);
        reject(e.message);
      }
    });
  }

  login(email, password): Promise<firebase.User> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.fireAuth.auth.signInWithEmailAndPassword(email, password);
        console.log("Login successful");
        resolve(response.user);
      } catch (e) {
        console.log("Login failed", e);
        reject(e.message);
      }
    });
  }

  async loginViaProvider(provider) {
    if (provider == "google") {
      return await this.loginViaGoogle();
    }
  }

  async loginViaGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    let response: any;
    if (!this.utilities.isApp()) {
      // This is for PWA
      try
      {
        response = await this.fireAuth.auth.signInWithRedirect(provider);
      }
      catch(e)
      {
        console.log(`Error when logging in via google ${e}`);
      }
    } else {
      // This is for the mobile app
      const gPlusResponse = await this.googlePlus.login({
        "webClientId": "497597677459-cckf5b01g08ss6cp232fq44ko572j83f.apps.googleusercontent.com",
        "offline": true,
        "scopes": "profile email"
      });
      response = await this.fireAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gPlusResponse.idToken));
    }

    // check if has profile, if none create it
    try {
      await this.profileProvider.getProfile().toPromise();
    } catch (e) {
      if (e == "No profile found") {
        const user = this.createUserProfileFromProvider(response.additionalUserInfo.profile);
        await this.profileProvider.updateProfile(user);
      }
    }
    console.log("Login successful");
    return response.user;
  }

  createUserProfileFromProvider(providerData) {
    let picture = providerData.picture || providerData.photoURL;
    // if picture is an object, this came from facebook then
    // retrieve the inner values
    if (typeof picture === "object" && picture !== null) {
      picture = picture.data.url;
    }

    return new User({
      firstName: providerData.given_name || providerData.first_name,
      lastName: providerData.family_name || providerData.last_name,
      email: providerData.email,
      cellNumber: providerData.phoneNumber || "",
      image: picture
    });
  }

  async logout() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.fireAuth.auth.signOut();
        console.log("Logout successful");
        resolve("Logout successful");
      } catch (e) {
        console.log("Logout failed", e);
        reject(e.message);
      }
    });
  }

  getLoggedInUser(): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
      this.fireAuth.auth.onAuthStateChanged(async user => {
        if (user) {
          resolve(user);
        } else {
          reject(null);
        }
      });
    });
  }
}
