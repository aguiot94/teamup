import { Injectable } from '@angular/core';
import { UserRequest } from '../models/user-request.model';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../models/notification.model';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable({
  providedIn: 'root'
})
export class UserRequestService {

  userRequest:UserRequest[] = []

  constructor(private notificationService: NotificationService) { }

sendUserRequest(request:UserRequest) {
  this.userRequest.push(request);
  //Save request at receiver's node
  firebase.database().ref('/users/' + request.receiverID + '/requests').push(this.userRequest);
  //Send notification to receiver
  const senderID = firebase.auth().currentUser.uid;
  const notificationContent:string = request.userName + " souhaite rejoindre votre projet " + request.projectTitle + ". Cliquez pour découvir son profil.";
  const notification = new Notification(notificationContent, request.receiverID, senderID);
  notification.projectID = request.projectID;

  //Get user picture
  firebase.database().ref('/users/' + notification.senderID + '/photo').on('value', (data: DataSnapshot)=> {
    const userPicture = data.val();
    notification.userPicture = userPicture;
  });
  this.notificationService.sendNotification(notification);
}


}
