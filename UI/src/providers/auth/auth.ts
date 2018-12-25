import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import superlogin from 'superlogin-client';
import { DebtsProvider } from '../debts/debts';
import { GooglePlus } from '@ionic-native/google-plus';
import { UtilitiesProvider } from '../utilities/utilities';

@Injectable()
export class AuthProvider {

  constructor(private storage: Storage,
    private debtsProvider: DebtsProvider,
    private googlePlus: GooglePlus,
    private utilities: UtilitiesProvider) {
    console.log('Hello AuthProvider Provider');
  }

  login(username, password) {
    let credentials = {
      username: username,
      password: password
    };

    return superlogin.login(credentials).then((res) => {
      superlogin.setSession(res);
      return res;
    });
  }

  async loginViaProvider(provider) {
    if (!this.utilities.isApp()) {
      // This is for PWA
      return superlogin.socialAuth(provider);
    } else {
      // This is for the mobile app
      if (provider.toLowerCase() == "google") {
        const response = await this.googlePlus.login({});
        return superlogin.tokenSocialAuth(provider, response.accessToken);
      }
    }

  }

  register(username, email, password, confirmPassword) {
    let user = {
      name: username,
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    };

    return superlogin.register(user);
  }

  async logout() {
    this.storage.remove("image");
    await this.debtsProvider.logout();
    return superlogin.logout();
  }

  async getInfo() {
    try {
      await this.debtsProvider.IsInitizialized();
      let session: any = superlogin.getSession();
      if (session == null) {
        return Promise.reject("No session");
      }
      const imageInCache = await this.storage.get("image");
      let imageInSession = "assets/imgs/user-placeholder.jpg";
      if (session.profile && session.profile.image) {
        imageInSession = session.profile.image;
      }
      console.log("Resolving with the user info...");
      const info = {
        name: session.user_id,
        image: imageInCache || imageInSession
      };
      // save to storage for caching
      this.storage.set("image", info.image);
      return Promise.resolve(info);
    }
    catch (e) {
      return Promise.reject(e);
    }
  }

  async updateUserPicture(id, image) {
    const data = {
      image: image
    };
    this.storage.set("image", image);
    return superlogin.getHttp().put(`change-image/${id}`, data);
  }

}
