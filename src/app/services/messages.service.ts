import { Injectable } from '@angular/core';
import { Message } from '../models/message.model';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;
import { M } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {


  conversation:Message[] = [];
  conversationSubject = new Subject<Message[]>();
  allConversations: Message[] = [];
  allConversationsSubject = new Subject<Message[]>();




  emitConversation(){
    this.conversationSubject.next(this.conversation);
  }

  emitAllConversations(){
    this.allConversationsSubject.next(this.allConversations);
  }

  createMessage(message:Message){
    this.conversation.push(message);
    this.saveMessage(message);
    this.emitConversation();
  } 

  getAllConversations(userID:string){
    firebase.database().ref('/users/' + userID + '/messages/').on('value', (data:DataSnapshot) => {
      this.allConversations = data.val() ? data.val() : [];
      this.emitAllConversations();
    });
  }

  getConversation(userID:string, conversationID:string){
    firebase.database().ref('/users/' + userID + '/messages/' + conversationID).on('value', (data:DataSnapshot) => {
      this.conversation = data.val() ? data.val() : [];
      this.emitConversation();
    });
  }

  saveMessage(message:Message){
    firebase.database().ref('/users/' + message.receiverID + '/messages/' + message.senderID).set(this.conversation);
    firebase.database().ref('/users/' + message.senderID + '/messages/' + message.receiverID).set(this.conversation);
  }

  constructor() {
    
  }
}
