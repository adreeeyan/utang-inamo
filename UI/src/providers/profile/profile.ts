import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../../models/user';

@Injectable()
export class ProfileProvider {

  private user: any = {};
  private usersLocation: string = "users";
  private picturesLocation: string = "pictures";

  constructor(private fireStore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private fireStorage: AngularFireStorage) {
    console.log('Hello ProfileProvider Provider');
  }

  init() {
    return new Promise((resolve) => {
      this.fireAuth.auth.onAuthStateChanged(async user => {
        console.log("changing auth state", user);
        if (user) {
          this.user = user;
        } else {
          this.user = {};
        }
        resolve();
      });
    });
  }

  updateProfile(user) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.fireStore.collection(this.usersLocation).doc(this.user.email).set({ ...user }, { merge: true });
        console.log("Update profile successful");
        resolve("Update profile successful");
      } catch (e) {
        console.log("Update profile failed", e);
        reject(e.message);
      }
    });
  }

  getProfile(user = null): Subject<User> {
    try {
      if (!user) {
        user = this.user.email;
      }
      let user$: Subject<User> = new Subject();
      const doc$ = this.fireStore.collection(this.usersLocation).doc(user);
      doc$.get().subscribe(async user => {
        if(!user.exists) {
          return user$.error("No profile found");
        }
        user$.next(new User({ ...user.data(), id: user.id }));
      });
      return user$;
    } catch (e) {
      console.log("Get profile failed", e);
      return e.message;
    }
  }

  updatePicture(picture) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.fireStorage.ref(`${this.picturesLocation}/${this.user.email}`).putString(picture, "data_url");
        const url = await this.fireStorage.ref(`${this.picturesLocation}/${this.user.email}`).getDownloadURL().toPromise();
        await this.updateProfile({ image: url });
        console.log("Update picture successful");
        resolve(response);
      } catch (e) {
        console.log("Update picture failed", e);
        reject(e.message);
      }
    });
  }

}
