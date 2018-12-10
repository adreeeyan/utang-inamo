import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import superlogin from 'superlogin-client';
import { DebtsProvider } from '../debts/debts';

@Injectable()
export class AuthProvider {

  constructor(private storage: Storage,
    private debtsProvider: DebtsProvider) {
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
      let session: any = superlogin.getSession();
      if (session == null) {
        return Promise.reject("No session");
      }
      const imageInCache = await this.storage.get("image");
      let imageInSession = "assets/imgs/user-placeholder.jpg";
      if (session.profile && session.profile.image) {
        imageInSession = session.profile.image;
      }
      return Promise.resolve({
        name: session.user_id,
        image: imageInCache || imageInSession
      });
    }
    catch (e) {
      return Promise.reject(e);
    }
  }

}
