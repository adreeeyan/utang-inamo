import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import superlogin from 'superlogin-client';

@Injectable()
export class AuthProvider {

  constructor(private storage: Storage) {
    console.log('Hello AuthProvider Provider');
  }

  login(username, password) {
    let credentials = {
      username: username,
      password: password
    };

    return superlogin.login(credentials);
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

  logout() {
    return superlogin.logout();
  }

  async getInfo() {
    try {
      let session = superlogin.getSession();
      const image = await this.storage.get("image");
      return Promise.resolve({
        name: session.user_id,
        image: image
      });
    }
    catch (e) {
      return Promise.reject(e);
    }
  }

}
