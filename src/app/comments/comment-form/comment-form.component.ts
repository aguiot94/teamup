import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { Comment } from '../../models/comment.model';
import * as firebase from 'firebase';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import {ProjetsService } from '../../services/projets.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit {

  @Input() projectUserID;
  @Input() nodeID;

  userID = firebase.auth().currentUser.uid;
  user:User;
  date: Date;
  annee:number;
  jour:number;
  mois:number;
  heure:number;
  minutes:number;
  

  commentForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private commentsService: CommentsService,
              private userService: UserService,
              private route: ActivatedRoute,
              private projetsService: ProjetsService) { }

  ngOnInit() {
    this.initForm();

//Get user informations
this.userService.getSingleUser(this.userID).then(
  (user:User) => {
    this.user = user;
  }
);

//Get today's date
this.date = new Date();
this.annee = this.date.getFullYear();
this.jour = this.date.getDay();
this.mois = this.date.getMonth();
this.heure = this.date.getHours();
this.minutes = this.date.getMinutes();

  }

  initForm() {
    this.commentForm = this.formBuilder.group({
      content: ['', Validators.required]
    });
  }

  onSaveComment() {
    const content = this.commentForm.get('content').value;
    const newComment = new Comment(content);
    newComment.userName = this.user.prenom + " " + this.user.nom;
    newComment.time = this.jour + "/" + this.mois + "/" + this.annee + " à " + this.heure + ":" + this.minutes;
    this.commentsService.saveComments(this.projectUserID, newComment, this.nodeID);
  }


}
