import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import {ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;

@Component({
  selector: 'app-user-single',
  templateUrl: './user-single.component.html',
  styleUrls: ['./user-single.component.css']
})
export class UserSingleComponent implements OnInit {

  user: User;
  userSubscription: Subscription;
  userID = firebase.auth().currentUser.uid;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) { }

  ngOnInit() {

    this.user = new User("", "", "", "");
    this.userService.getSingleUser(this.userID).then(
      (user: User) => {
        this.user = user;
      }
    );

  }

}
