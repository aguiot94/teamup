import { Component, OnInit, OnDestroy } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { Subscription } from 'rxjs/Subscription';
import { Task } from '../../models/task.model';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit, OnDestroy {

  tasks: Task[];
  tasksSubscription: Subscription;
  userID = firebase.auth().currentUser.uid;
  showTaskForm:boolean = false;

  constructor(private tasksService: TasksService,
              private router: Router) { }

  ngOnInit() {
    this.tasksSubscription = this.tasksService.tasksSubject.subscribe(
      (tasks: Task[]) => {
        this.tasks = tasks;
      }
    );
    this.tasksService.emitTasks();
  }

  onNewTask() {
    this.showTaskForm = true;
  }

  onDeleteTask(task: Task) {
    this.tasksService.removeTask(task);
  }

  onViewTask(projectID:number, taskID:number){
    this.router.navigate(['/users/' + this.userID + '/projets/' + projectID + '/tachesAFaire' + taskID ]);
  }

  ngOnDestroy(){
    this.tasksSubscription.unsubscribe();
  }

}
