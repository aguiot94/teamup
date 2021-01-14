import { Component, OnDestroy, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ProjetsService } from '../../services/projets.service';
import { Projet } from '../../models/projet.model';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { animate, style, transition, trigger } from '@angular/animations';
import DataSnapshot = firebase.database.DataSnapshot;
import { UserRequestService } from '../../services/user-request.service';
import { UserRequest } from '../../models/user-request.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { VerticalHeaderService } from '../../services/vertical-header.service';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-projets-list',
  templateUrl: './projets-list.component.html',
  styleUrls: ['./projets-list.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger(
      'slideInRight', 
      [
        transition(
          ':enter',
          [
            style({transform: 'translateX(500px)'}),
            animate('500ms ease-out',
                    style({transform: 'translateX(0)'}))
          ]
        ), 
        transition(
          ':leave',
          [
            style({transform: 'translateX(0)'}),
            animate('500ms ease-in', 
            style({transform: 'translateX(500px)'}))
          ]
        )
      ]
    )
  ]
})

export class ProjetsListComponent implements OnInit, OnDestroy {

  allProjets: Projet[];
  allProjetsSubscription: Subscription;
  projectOpened:boolean = false;
  projectToDisplay:Projet;
  selectedIndex:number = null;
  searchText:string = "";
  searchTextSubscription: Subscription;
  requestSent:boolean = false;


  constructor(private projetsService: ProjetsService,
              private router : Router,
              private userRquestService : UserRequestService,
              private userService: UserService,
              private verticalHeaderService: VerticalHeaderService,
              private messagesService: MessagesService) { }

  ngOnInit() {

    //Open vertical header
    this.verticalHeaderService.openVerticalHeader()

    //Get all projects
    this.allProjetsSubscription = this.projetsService.allProjetsSubject.subscribe(
      (projets: Projet[]) => {
        this.allProjets = projets;
      }
    );
    this.projetsService.emitProjets();
  }

  onSendMessage(userID:string){
    this.router.navigate(['/message', 'view', userID]);
  }


  onNewProjet() {
    this.router.navigate(['/projets', 'new']);
  }

  onDeleteProjet(projet: Projet) {
    const userID = firebase.auth().currentUser.uid;
    this.projetsService.removeProjet(projet, userID);
  }

  onViewProjet(id: number) {
    this.router.navigate(['/projets',  id]);
  }

  toggleProject(projet: Projet, index:number){
    this.requestSent = false;
    //Open or close the project preview when clicked
    //this.projectOpened ? this.projectOpened = false : this.projectOpened = true;
    if(this.projectToDisplay === projet){
      this.projectOpened = false;
      this.projectToDisplay = undefined;
    } else {
      //Get the clicked project information
      this.projectToDisplay = projet;
      this.projectOpened = true;
    }
    //Set the active class to the clicked button
    this.selectedIndex = index;

  } 

  closePreview(){
    this.projectOpened = false;
    this.projectToDisplay = undefined;
  }


  onSendRequest(projet:Projet){
    const userID = firebase.auth().currentUser.uid;
    let projectID;
    firebase.database().ref('/users/' + projet.userID + '/projets/').orderByChild('titre').equalTo(projet.titre).once('value', (data: DataSnapshot)=> {
      projectID = Object.keys(data.val());
    });
    //Wait till we get user's data to create and send the request
    this.userService.getSingleUser(userID).then(
      (user: User) => {
        let newRequest = new UserRequest(false, true);
        newRequest.projectTitle = projet.titre;
        newRequest.receiverID = projet.userID;
        newRequest.userName = user? user.prenom + " " + user.nom : "unknown user";
        newRequest.projectID = '/users/' + projet.userID + '/projets/' + projectID[0];
        this.userRquestService.sendUserRequest(newRequest);
        this.requestSent = true;
      }
    );
  }


  ngOnDestroy() {
    this.allProjetsSubscription.unsubscribe();
  }

}
