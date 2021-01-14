import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Task } from '../models/task.model';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable({
  providedIn: 'root'
})

export class TasksService {

  tasks: Task[] = [];
  tasksSubject = new Subject<Task[]>();
  //userID = firebase.auth().currentUser.uid;

  emitTasks() {
    this.tasksSubject.next(this.tasks);
  }

  saveTasks(projectTitle:string, userID:string) {
    console.log(this.tasks);
    firebase.database().ref('/tasks/' + userID + '/' + projectTitle).set(this.tasks);
  }
  
  createNewTask(newTask: Task) {
    this.tasks.push(newTask);
    this.emitTasks();
  }

  removeTask(task: Task) {
    const taskIndexToRemove = this.tasks.findIndex(
      (taskEl: Task) => {
        if(taskEl === task) {
          return true;
        }
      }
    );
    this.tasks.splice(taskIndexToRemove, 1);
    //need save function ? 
    this.emitTasks();
  }

/*
  getTasks() {
    firebase.database().ref('/tasks/' + this.userID).on('value', (data: DataSnapshot) => {
      this.tasks = data.val() ? data.val() : [];
      this.emitTasks();
    } );
  }
  */

/*
  getSingleTask(projectID:number, taskID:number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/users/' + this.userID + '/projets/' + projectID + '/tachesAFaire' + taskID).once('value').then(
          (data: DataSnapshot) => {
            resolve(data.val());
          }, 
          (error) => {
            reject(error);
          }
        );
      }
    );
  }
  */


  constructor() { 
  }
}
