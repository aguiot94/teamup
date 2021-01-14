import { Component, OnInit } from '@angular/core';
import { Message } from '../../models/message.model';
import { MessagesService } from '../../services/messages.service';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.css']
})
export class MessagesListComponent implements OnInit {

  allConversations:Message[] = [];
  allConversationsSubscription: Subscription;
  userID:string = firebase.auth().currentUser.uid;

  constructor(private messagesService: MessagesService,
              private userService: UserService) { 
    this.messagesService.getAllConversations(this.userID);
  }

  ngOnInit() {
    this.allConversationsSubscription = this.messagesService.allConversationsSubject.subscribe(
      (messages: Message[]) => {
        this.allConversations = messages;
        console.log(this.allConversations)
      }
    );
    this.messagesService.emitAllConversations();
  }

}
