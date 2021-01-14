import { Component, OnInit, resolveForwardRef } from '@angular/core';
import { Projet } from '../../models/projet.model';
import { ProjetsService } from '../../services/projets.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { UserRequest } from '../../models/user-request.model';
import { UserRequestService } from '../../services/user-request.service';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;

@Component({
  selector: 'app-projet-single',
  templateUrl: './projet-single.component.html',
  styleUrls: ['./projet-single.component.css']
})
export class ProjetSingleComponent implements OnInit {

  projet: Projet;
  userID = firebase.auth().currentUser.uid;
  tasks: Task[];
  projectUserID;
  projectTitle;
  projectTitleToCheck = (projet: Projet) => projet.titre == this.projectTitle;
  nodeID;

  constructor(private projetsService: ProjetsService,
              private tasksService: TasksService,
              private route: ActivatedRoute,
              private router: Router,
              private userRequestService: UserRequestService,
              private userService: UserService) { 

              }

  ngOnInit() {
    console.log(this.userID);
    this.projet = new Projet("", false);
    const id = this.route.snapshot.params['id'];
    this.projet = this.projetsService.getSingleProjet(+id);
    this.projectTitle = this.projet.titre;
    this.tasks = this.projet.tachesAFaire;
    this.projectUserID = this.projet.userID;
    this.getNodeID();
  }

  getNodeID(){
    firebase.database().ref('/users/' + this.projectUserID).once('value', (data: DataSnapshot) => {
      this.nodeID = data.val().projets.findIndex((this.projectTitleToCheck));
    });
  }

  getFilteredTasks(id:number){
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/users/' + this.userID + '/projets/' + id ).once('value').then(
          (data: DataSnapshot) => {
            this.tasks = data.val().tachesAFaire;
            resolve(data.val().tachesAFaire);
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  getProjectPath(){
    return ('/users/' + this.projet.userID + '/projets/' + this.nodeID);
  }

  onSendRequest(){
    let request = new UserRequest(false, true);
    this.userService.getSingleUser(this.userID).then(
      (data: User) => {
        request.userName = data.prenom + " " + data.nom;
        request.projectID = this.getProjectPath();
        console.log(request.projectID);
    request.projectTitle = this.projet.titre;
    request.receiverID = this.projet.userID;
    this.userRequestService.sendUserRequest(request);
      }
    );
  }

  onViewTask(){
    console.log('voir la tache');
  }

  onNewTask() {
    console.log('Ajouter une tache');
  }

  onDeleteTask() {
    console.log('supprimer la tache');
  }

  onBack() {
    this.router.navigate(['/projets']);
  }

}
