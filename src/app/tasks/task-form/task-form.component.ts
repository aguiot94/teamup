import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {

  taskForm: FormGroup;
  tasks;
  indexToAdd:number = 0;

  constructor(private fb: FormBuilder,
              private tasksService: TasksService) { }

  ngOnInit() {
    this.taskForm = this.fb.group({
      tasks: this.fb.array([this.createItem()])
    })
  }

  createItem() {
    return this.fb.group({
      titre: new FormControl(""),
      description: new FormControl("")
    })
  }

  addItem() {
    this.tasks = this.taskForm.get('tasks') as FormArray;
    this.tasks.push(this.createItem());
    const newTask = new Task(this.tasks.value[this.indexToAdd].titre, false);
    newTask.description = this.tasks.value[this.indexToAdd].description;
    this.tasksService.createNewTask(newTask);
    this.indexToAdd++;
  }


}
