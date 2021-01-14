import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Comment } from '../models/comment.model';
import DataSnapshot = firebase.database.DataSnapshot;
import { Subject } from 'rxjs/Subject';


@Injectable({
  providedIn: 'root'
})
export class CommentsService {
userID = firebase.auth().currentUser.uid;
projectID:number;
comments:Comment[];
commentsSubject = new Subject<Comment[]>();

emitComments(){
  this.commentsSubject.next(this.comments);
}


saveComments(userID, comment:Comment, projectID:number) {
  this.comments.push(comment);
  firebase.database().ref('/users/' + userID + '/projets/' + projectID + '/commentaires').set(this.comments);
  this.emitComments();
}

getComments(userID, projectID:number) {
  firebase.database().ref('/users/' + userID + '/projets/' + projectID + '/commentaires').on('value', (data: DataSnapshot) => {
    this.comments = data.val() ? data.val() : [];
    this.emitComments();
  });
}



  constructor() { 
  }
}
