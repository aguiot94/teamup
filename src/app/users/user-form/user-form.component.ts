import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  userForm: FormGroup;
  fileIsUploading:boolean = false;
  fileURL:string;
  fileIsUploaded:boolean = false;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.userForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      mail: ['', Validators.required],
      telephone: ''
    });
  }

  onSaveUser(){
    const nom = this.userForm.get('nom').value;
    const prenom = this.userForm.get('prenom').value;
    const mail = this.userForm.get('mail').value;
    const telephone = this.userForm.get('telephone').value;
    const newUser = new User(nom, prenom, mail, telephone);
    if(this.fileURL && this.fileURL !== ""){
      newUser.photo = this.fileURL;
    }
    this.userService.createNewUser(newUser);
    this.router.navigate(['/projets']);
  }

  onUploadFile(file:File){
    this.fileIsUploading = true;
    this.userService.uploadFile(file).then(
      (url:string) => {
        this.fileURL = url;
        this.fileIsUploading = false;
        this.fileIsUploaded = true;
      }
    );
  }

  detectFiles(event){
    this.onUploadFile(event.target.files[0]);
  }

}
