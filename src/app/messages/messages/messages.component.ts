import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Message } from '../../models/message.model';
import { MessagesService } from '../../services/messages.service';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';
import { ActivatedRoute } from '@angular/router';
import { VerticalHeaderService } from '../../services/vertical-header.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MessagesComponent implements OnInit, OnDestroy {

  conversation: Message[] = [];
  conversationSubscription : Subscription;
  message:string = "";
  userID:string;
  otherUserID:string;
  user:User;
  otherUser:User;


  constructor(private messagesService: MessagesService,
              private route: ActivatedRoute,
              private verticalHeaderService: VerticalHeaderService,
              private userService: UserService) { 
    
    this.userID = firebase.auth().currentUser.uid;
    this.otherUserID = this.route.snapshot.params['id'];
    this.messagesService.getConversation(this.userID, this.otherUserID);

    //Get other user information
    this.userService.getSingleUser(this.otherUserID).then(
      (user:User) => {
        this.otherUser = user;
        console.log(this.otherUser);
      }
    );
  }

  ngOnInit() {
    
    this.verticalHeaderService.openVerticalHeader()
    this.conversationSubscription = this.messagesService.conversationSubject.subscribe(
      (messages:Message[]) => {
        this.conversation = messages;
      }
    );

      setTimeout(
        () => {
          this.scrollTobottom();
        }, 1000
      );

      //Get current user information
      this.userService.getSingleUser(this.userID).then(
        (user:User) => {
          this.user = user;
        }
      );

    this.messagesService.emitConversation();

  }

  scrollTobottom(){
    let messageView = document.querySelector('.message-view');
    messageView.scrollTop = messageView.scrollHeight;
  }

  ngOnDestroy(){
    this.conversationSubscription.unsubscribe();
  }

  onSendMessage(receiverID:string){
    const senderID = firebase.auth().currentUser.uid;
    const content = this.message;
    const newMessage = new Message(senderID, receiverID, content);
    this.messagesService.createMessage(newMessage);
    document.body.scrollTop = 999999;
    let input:HTMLInputElement = document.querySelector('#message-input');
    input.value = "";
  }

}
