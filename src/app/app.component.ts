import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { VerticalHeaderService } from './services/vertical-header.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'team-up'; 
  verticalHeader:boolean = false;
  verticalHeaderSubscription: Subscription;
  searchText:string = "";

  ngOnInit(){
        //Get vertical header status
        this.verticalHeaderSubscription = this.verticalHeaderService.verticalHeaderSubject.subscribe(
          (isOpened:boolean) => {
            this.verticalHeader = isOpened;
          }
        );
  }


  constructor(private verticalHeaderService: VerticalHeaderService) {

    var firebaseConfig = {
      apiKey: "AIzaSyAZWSq6aJm6sj3pS_RD7gOIKbmApghuo1s",
      authDomain: "team-up-eb33a.firebaseapp.com",
      databaseURL: "https://team-up-eb33a.firebaseio.com",
      projectId: "team-up-eb33a",
      storageBucket: "team-up-eb33a.appspot.com",
      messagingSenderId: "830816525129",
      appId: "1:830816525129:web:c4bb63d8430dd5f450d898"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    

  }


  searchTextEventHandler($event:any){
    this.searchText = $event;
  }

}
