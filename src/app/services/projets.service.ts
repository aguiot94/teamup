import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Projet } from '../models/projet.model';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;
import { Task } from '../models/task.model';
import { Subscription } from 'rxjs/Subscription';
import { TasksService} from '../services/tasks.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProjetsService implements OnDestroy {

  userProjets: Projet[] = [];
  userProjetsSubject = new Subject<Projet[]>();
  //userID = firebase.auth().currentUser.uid;
  tasks: Task[];
  tasksSubscription: Subscription;
  allProjets:Projet[] = [];
  allProjetsSubject = new Subject<Projet[]>();

  emitProjets() {
    this.userProjetsSubject.next(this.userProjets);
    this.allProjetsSubject.next(this.allProjets);
  }

  saveProjets(userID:string){
    firebase.database().ref('/users/' + userID + '/projets').set(this.userProjets);
  }


  getProjets(userID:string) {
    this.userProjets = [];
    firebase.database().ref('/users/' + userID + '/projets').on('value', (data: DataSnapshot) => {
      this.userProjets = data.val() ? data.val() : [];
      this.emitProjets();
    });
  }
  

  getAllProjets() {
    firebase.database().ref('/users').on('value', (data: DataSnapshot) => {
      let allUsers:User[] = data.val() ? Object.values(data.val()) : [];
      let projets:Projet[] = [];
      for(const user of allUsers){
        if(user.hasOwnProperty('projets')){
          projets.push(user.projets);
        }
      }
      this.allProjets = projets.flat();
      this.emitProjets();
    });
  }


  getSingleProjet(id:number) {
    return this.allProjets[id];
  }

  createNewProjet(newProjet: Projet, userID:string) {
    this.getProjets(userID);
    this.userProjets.push(newProjet);
    this.saveProjets(userID);
    this.emitProjets();
  }

  removeProjet(projet: Projet, userID:string) {
    const projetIndexToRemove = this.userProjets.findIndex(
      (projetEl) => {
        if(projetEl === projet) {
          return true;
        }
      }
    );
    this.userProjets.splice(projetIndexToRemove, 1);
    this.saveProjets(userID);
    this.emitProjets();
  }

  constructor(private tasksService: TasksService) { 
    //this.getProjets();

    this.tasksSubscription = this.tasksService.tasksSubject.subscribe(
      (tasks: Task[]) => {
          this.tasks = tasks;
        }
    );

    this.tasksService.emitTasks();
    this.getAllProjets();
  }


  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const pictureName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/' + pictureName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement…');
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error);
            reject();
          },
          () => {
            resolve(upload.snapshot.ref.getDownloadURL());
          }
        );
      }
    );
}



ngOnDestroy(){
  this.tasksSubscription.unsubscribe();
}

}
