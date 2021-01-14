import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable({
  providedIn: 'root'
})

export class UserService {

  user: User;
  userSubject = new Subject<User>();
  userID;

  allUsers:User[] = [];
  allUsersSubject = new Subject<User[]>();

  emitUser() {
    this.userSubject.next(this.user);
    this.allUsersSubject.next(this.allUsers);
  }

  saveUser(){
    this.userID = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + this.userID).set(this.user);
  }

  getAllUsers(){
    firebase.database().ref('/users').on('value', (data: DataSnapshot) => {
      this.allUsers = data.val() ? data.val() : [];
      this.emitUser();
    });
  }


  getSingleUser(uid) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/users/' + uid).once('value').then(
          (data: DataSnapshot) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }


  createNewUser(newUser: User) {
    this.user = newUser;
    this.saveUser();
    this.emitUser();
  }

  uploadFile(file:File){
    return new Promise(
      (resolve, reject) => {
        const fileName = Date.now().toString();
        const upload = firebase.storage().ref().child('images/' + fileName).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
            () => {
              console.log("Chargements ...");
            },
            (error) => {
              console.log("Erreur de chargement");
              reject();
            },
            () => {
              resolve(upload.snapshot.ref.getDownloadURL());
            }
          );
      }
    );
  }

  constructor() { 
    this.getAllUsers();
  }
}
