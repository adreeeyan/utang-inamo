import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { User } from '../../models/user';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { Events } from 'ionic-angular';

@Injectable()
export class ContactsProvider {

  private contactsLocation: string = "contacts";
  private usersLocation: string = "users";
  private contactsPictureLocation: string = "contacts";
  private contactsCollection: AngularFirestoreCollection;

  // Subscriptions
  private contactsCollectionSnapshot: Subscription;
  private contactSnapshot: Subscription;

  constructor(private fireStore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private fireStorage: AngularFireStorage,
    private events: Events) {
    console.log('Hello ContactsProvider Provider');

    // set debts reference
    this.fireAuth.auth.onAuthStateChanged(async user => {
      if (user) {
        this.contactsCollection = this.fireStore.collection(`${this.usersLocation}/${user.email}/${this.contactsLocation}`);
      } else {
        this.contactsCollection = null;
      }
    });

    this.events.subscribe("user:logout", this.clearSubscription.bind(this));
  }

  getContacts(): Subject<User[]> {
    let contacts$: Subject<User[]> = new Subject();
    try {
      this.contactsCollectionSnapshot = this.contactsCollection.snapshotChanges().subscribe(async collection => {
        contacts$.next(collection.map(doc => new User({ ...doc.payload.doc.data(), id: doc.payload.doc.id })));
      });
      return contacts$;
    } catch (e) {
      console.log("Get contacts failed", e);
      return e.message;
    }
  }

  getContact(id): Subject<User> {
    try {
      let contact$: Subject<User> = new Subject();
      const doc$ = this.contactsCollection.doc(id);
      this.contactSnapshot = doc$.snapshotChanges().subscribe(async contact => {
        const contactObj = new User({ ...<any>contact.payload.data(), id: contact.payload.id });
        contact$.next(contactObj);
      });
      return contact$;
    } catch (e) {
      console.log("Get contact failed", e);
      return e.message;
    }
  }

  createContact(contact): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const docRef = await this.contactsCollection.add({ ...contact });
        console.log("Create contact successful");
        resolve(docRef.id);
      } catch (e) {
        console.log("Create contact failed", e);
        reject(e.message);
      }
    });
  }

  updateContact(contact) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.contactsCollection.doc(contact.id).set({ ...contact }, { merge: true });
        console.log("Update contact successful");
        resolve("Update contact successful");
      } catch (e) {
        console.log("Update contact failed", e);
        reject(e.message);
      }
    });
  }

  deleteContact(contact) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.contactsCollection.doc(contact.id).delete();
        console.log("Delete contact successful");
        resolve("Delete contact successful");
      } catch (e) {
        console.log("Delete contact failed", e);
        reject(e.message);
      }
    });
  }

  updatePicture(contact, picture) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.fireStorage.ref(`${this.contactsPictureLocation}/${contact.id}`).putString(picture, "data_url");
        const url = await this.fireStorage.ref(`${this.contactsPictureLocation}/${contact.id}`).getDownloadURL().toPromise();
        // set url
        contact.image = url;
        await this.updateContact(contact);
        console.log("Update picture successful");
        resolve(response);
      } catch (e) {
        console.log("Update picture failed", e);
        reject(e.message);
      }
    });
  }

  clearSubscription()
  {
    try
    {
      this.contactsCollectionSnapshot.unsubscribe();
      this.contactSnapshot.unsubscribe();
  
      this.events.unsubscribe("user:logout");
    }
    catch
    {
      // We should be doing some catching here
    }    
  }

}
