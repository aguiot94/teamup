import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase';
import { Notification } from '../models/notification.model';
import { NotificationService } from '../services/notification.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean;
  notifications: Notification[] = [];
  notificationsSubscription : Subscription;
  gotNotification:boolean = false;
  numberOfNotifications:number;

  constructor(private authService: AuthService,
              private notificationService: NotificationService,
              private router: Router) { }

  ngOnInit() {

    firebase.auth().onAuthStateChanged(
      (user) => {
        if(user) {
          this.isAuth = true;
        } else {
          this.isAuth = false;
        }
      }
    );

    //Get notifications
    this.notificationsSubscription = this.notificationService.notificationsSubject.subscribe(
      (notifications:Notification[]) => {
        if(notifications === []){
          this.gotNotification = false;
        } else {
          this.notifications = notifications;
          this.gotNotification = true;
          this.numberOfNotifications = this.notifications.length;
        }
      }
    );

  }

  onViewNotification(){
    let notificationBox:HTMLElement = document.querySelector('.notification-box');
    if(notificationBox.style.display === "none"){
      notificationBox.style.display = "block";
    } else {
      notificationBox.style.display = "none";
    }
  }

  onViewSingleNotification(id:number){
    this.router.navigate(['/user', 'view', id]);
  }

  onAcceptRequest(projectPath:string, contributorID:string, notification:Notification ){
    console.log(projectPath);
    console.log(contributorID);
    firebase.database().ref(projectPath + "/contributorsID").push(contributorID);
    this.notificationService.removeNotification(notification);
  }

  onDenieRequest(notification:Notification){
    this.notificationService.removeNotification(notification);
  }

  onClickedOutside(event:Event) {
    let notificationBox:HTMLElement = document.querySelector('.notification-box');
    const notificationButton:HTMLElement = document.querySelector('button.exclude_outside_click');
    const notificationIcon:HTMLElement = document.querySelector('i.exclude_outside_click');
    if(event.target === notificationButton || event.target === notificationIcon) {
      return true;
    } else {
      notificationBox.style.display = "none";
    }
  }


  onSignOut() {
    this.authService.signOutUser();
  }

}
