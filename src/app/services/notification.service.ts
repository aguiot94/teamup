import { Injectable } from '@angular/core';
import { Notification } from '../models/notification.model';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notifications:Notification[] = [];
  notificationsSubject = new Subject<Notification[]>();
  externalUsersNotification:Notification[] = [];

  constructor() { 
    firebase.auth().onAuthStateChanged(
      (user) => {
        if(user) {
          this.getNotifications();
        }
      }
    );
  }

 emitNotifications(){
   this.notificationsSubject.next(this.notifications);
 } 


sendNotification(notification:Notification){
  //First get all the users notifications so we can push our notification
  firebase.database().ref('/users/' + notification.receiverID + "/notifications").on('value', (data:DataSnapshot) => {
    this.externalUsersNotification = data.val() ? data.val() : [];
  });
  //Add our notification then send the updated array back to the database
  this.externalUsersNotification.push(notification);
  firebase.database().ref('/users/' + notification.receiverID + '/notifications').set(this.externalUsersNotification);
  this.emitNotifications();
}

saveNotifications(receiverID:string){
  firebase.database().ref('/users/' + receiverID + '/notifications').set(this.notifications);
}

getNotifications(){
  let userID = firebase.auth().currentUser.uid;
  firebase.database().ref('/users/' + userID + '/notifications').on('value', (data:DataSnapshot) => {
    this.notifications = data.val() ? data.val() : [];
    this.emitNotifications();
  } );
}

removeNotification(notification: Notification){
  const indexToRemove = this.notifications.findIndex(
    (notificationEl) => {
      if(notification === notificationEl){
        return true;
      }
    }
  );
  this.notifications.splice(indexToRemove, 1);
  this.saveNotifications(notification.receiverID); 
  this.emitNotifications();
}

}
