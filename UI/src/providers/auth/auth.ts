import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import superlogin from 'superlogin-client';

@Injectable()
export class AuthProvider {

  constructor(public http: HttpClient) {
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

}
