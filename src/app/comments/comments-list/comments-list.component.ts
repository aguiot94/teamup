import { Component, OnInit, Input } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { Comment } from '../../models/comment.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.css']
})
export class CommentsListComponent implements OnInit {

  @Input() projectUserID;
  comments:Comment[];
  commentsSubscription: Subscription;
  @Input() nodeID;



  constructor(private commentsService: CommentsService,
              private route: ActivatedRoute) { 
              }

  ngOnInit() {
    //Get this project comments
    this.commentsService.getComments(this.projectUserID, this.nodeID);
    //Subscribe to comments list
    this.commentsSubscription = this.commentsService.commentsSubject.subscribe(
      (comments: Comment[]) => {
        this.comments = comments;
      }
    );
    this.commentsService.emitComments();
  }

}
