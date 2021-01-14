import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent} from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Projet } from '../../models/projet.model';
import { ProjetsService } from '../../services/projets.service';
import { Router } from '@angular/router';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from '../../tasks/task-form/task-form.component';
import { TasksService } from '../../services/tasks.service';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs/Subscription';
import { CompetencesService } from '../../services/competences.service';
import { VerticalHeaderService } from '../../services/vertical-header.service';


@Component({
  selector: 'app-projet-form',
  templateUrl: './projet-form.component.html',
  styleUrls: ['./projet-form.component.css']
})
export class ProjetFormComponent implements OnInit {

  projetForm: FormGroup;
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;
  counter = 0;
  indexToAdd = 0;
  userID = firebase.auth().currentUser.uid;
  fileIsUploading:boolean = false;
  fileIsUploaded:boolean = false;
  fileURL:string;
  currentTab:number = 0;

  separatorKeysCodes = [ENTER, COMMA];

  skillsCtrl = new FormControl();

  filteredSkills: Observable<any[]>;

  skills = [
    'Développement front-end',
  ];

  allSkills = [
    'Développement front-end',
    'Développement back-end',
    'Graphisme',
    'Communication',
    'Marketing'
  ];

  allSkillsSubscription: Subscription;

  indexToRemove:number = this.projetsService.tasks.length;
  formIsValid:boolean = true;
  user:User;
  //Task form
  tasks:Task[] = [];  
  taskForm: FormGroup;
  taskCanBeSent:boolean = true;
 



  @ViewChild('skillInput') skillInput: ElementRef;

  constructor(private projetsService: ProjetsService,
              private formBuilder : FormBuilder,
              private router: Router,
              private taskFormComponent: TaskFormComponent,
              private tasksService: TasksService,
              private competencesService: CompetencesService,
              private verticalHeaderService: VerticalHeaderService) {

                this.filteredSkills = this.skillsCtrl.valueChanges.pipe(
                  startWith(null),
                  map((skill: string | null) => skill ? this.filter(skill) : this.allSkills.slice()));
               }

  
  //Handle autocomplete skills input

  add(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value;

  // Add our skill
  if ((value || '').trim()) {
    this.skills.push(value.trim());
    console.log(this.skills);
    this.allSkills.push(value.trim())
  }

  // Reset the input value
  if (input) {
    input.value = '';
  }

  this.skillsCtrl.setValue(null);
}

remove(skill: any): void {
  const index = this.skills.indexOf(skill);

  if (index >= 0) {
    this.skills.splice(index, 1);
  }
}

filter(name: string) {
  return this.allSkills.filter(skill =>
      skill.toLowerCase().indexOf(name.toLowerCase()) === 0);
}

selected(event: MatAutocompleteSelectedEvent): void {
  this.skills.push(event.option.viewValue);
  this.skillInput.nativeElement.value = '';
  this.skillsCtrl.setValue(null);
}

  ngOnInit() {
    this.initForm();
    this.showTab(this.currentTab);
    this.verticalHeaderService.openVerticalHeader();

    //Get User information
    firebase.database().ref('/users/' + this.userID).once('value', (data: DataSnapshot) => {
      this.user = data.val();
    });

    //Get all skills - Subscription
    this.allSkillsSubscription = this.competencesService.competencesSubject.subscribe(
      (competences) => {
        this.allSkills = Object.values(competences);
      }
    );
    this.competencesService.emitCompetences();

  }

  initForm() {
    this.projetForm = this.formBuilder.group({
      titre: ["", Validators.required],
      description: [[], Validators.required],
      competences: ["", Validators.required],
      titreTache: ["", Validators.required],
      descriptionTache: ["", Validators.required]
    });
  }


  checkProjectTitle() {
    let projectTitleAlreadyExists:boolean = false;
    let projectTitle = this.projetForm.get('titre').value;
    let projetTitles = [];
    
    //Get all projects titles

    firebase.database().ref('/users/' + this.userID + '/projets').on('value', (data: DataSnapshot ) => {
      for(const projet of data.val()) {
        projetTitles.push(projet.titre);
      }
    } );

    //Check if the title already exists
    for(const title of projetTitles) {
      if(title == projectTitle ) {
        projectTitleAlreadyExists = true;
      } else {
        projectTitleAlreadyExists = false;
      }
    }
  
  if(projectTitleAlreadyExists) {
    this.formIsValid = false;
  } else {
    this.formIsValid = true;
  }

  }

  onAddTask(){
    const titre = this.projetForm.get('titreTache').value;
    console.log(titre);
    const description = this.projetForm.get('descriptionTache').value;
    console.log(description);
    if(titre != "" && description != ""){
      let task = new Task(titre, false);
      task.description = description;
      console.log(task);
      this.tasks.push(task);
      console.log(this.tasks);
      this.projetForm.patchValue({
        titreTache: "",
        descriptionTache: ""
      });
      this.taskCanBeSent = true;
      console.log(this.taskCanBeSent);
    } else {
      this.taskCanBeSent = false;
    }
  
    
  }

  onSaveProjet() {
    const titre = this.projetForm.get('titre').value;
    const description = this.projetForm.get('description').value;
    const competences = this.skills;
    const newProjet = new Projet(titre, false);
    newProjet.description = description;
    newProjet.userID = this.userID;
    newProjet.userName = this.user.prenom + " " + this.user.nom;
    newProjet.userPhoto = this.user.photo;
    if(this.fileURL && this.fileURL !== '') {
      newProjet.photo = this.fileURL;
    }

    // Remove cached value
    /*let tasks = this.projetsService.tasks;
    if(this.indexToRemove > 0) {
      tasks.splice(0,this.indexToRemove);
    newProjet.tachesAFaire = tasks;
    } else {
      newProjet.tachesAFaire = tasks;
    }*/
    newProjet.tachesAFaire = this.tasks;
    newProjet.competencesRecherchees = competences;
    this.competencesService.saveCompetences(competences);

    //Only submit if project title does not exist
    this.checkProjectTitle();
    if(this.formIsValid) {
      this.projetsService.createNewProjet(newProjet, this.userID);
      this.router.navigate(['/projets']);
        } else {
      return false;
        }
    
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.projetsService.uploadFile(file).then(
      (url: string) => {
        this.fileURL = url;
        this.fileIsUploading = false;
        this.fileIsUploaded = true;
      }
    );
}

  showTab(tab:number){
    //Displays the specified tab
    let tabs = document.getElementsByClassName('tab') as HTMLCollectionOf<HTMLElement>;
    tabs[tab].style.display = "block";

    //Handles the previous and next button
    if(tab == 0){
      document.getElementById('prevBtn').style.display = "none";
    } else {
      document.getElementById("prevBtn").style.display = "inline";
    }

    //Displays the correct step indicator
    this.setStepIndicator(tab);

  }

  setStepIndicator(tab:number){
    //Removes the active class from all steps
    let steps = document.getElementsByClassName('step') as HTMLCollectionOf<HTMLElement>;
    for(let i = 0; i < steps.length; i++){
      steps[i].className = steps[i].className.replace('active','');
    }
    //Then add the active class to the current step
    steps[tab].className += " active";

  }

  nextPrev(tab:number){
    //Displays the correct tab on click on previous/next button
    let tabs = document.getElementsByClassName('tab') as HTMLCollectionOf<HTMLElement>;
    //Exit the function if any field is invalid
    if(tab == 1 && !this.validateForm() ){
      return false;
    }
    //Hide the current tab
    tabs[this.currentTab].style.display = "none";
    //Increase or decrease current tab by one
    this.currentTab = this.currentTab + tab;
    //Display the correct tab
    this.showTab(this.currentTab); 
  }

  validateForm(){
    //Handles the forms valdidation
    let tabs = document.getElementsByClassName('tab') as HTMLCollectionOf<HTMLElement>;
    let tabInputs = tabs[this.currentTab].getElementsByTagName('input');
    let valid = true;
    //Checks every input value to see if it's empty or not (for first and third tabs)
    if(this.currentTab == 1){
      let chips = document.getElementsByTagName('mat-chip') as HTMLCollectionOf<HTMLElement>;
      if(chips.length === 0){
        valid = false;
      } else {
        valid = true;
      }
    } else if(this.currentTab == 2){ //Task form
      //Are there any tasks that have already been added ? 
      let tasks = document.getElementsByClassName('task') as HTMLCollectionOf<HTMLElement>;
      if(tasks.length > 0) {
        valid = true;
      } else {
        valid = false;
      }
    } else {
      for(let i = 0; i < tabInputs.length; i++){
        if(tabInputs[i].value == ""){
          tabInputs[i].className += " invalid";
          valid = false;
        }
      }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
      document.getElementsByClassName("step")[this.currentTab].className += " finish";
    }
    return valid;
    }

detectFiles(event) {
  this.onUploadFile(event.target.files[0]);
}
  

}
