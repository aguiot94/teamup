import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable({
  providedIn: 'root'
})
export class CompetencesService {

  competences = ["graphisme"];
  competencesSubject = new Subject();

  emitCompetences(){
    this.competencesSubject.next(this.competences);
  }

  saveCompetences(competences){
    this.competences.push(competences);
    let uniqueCompetences = [... new Set(this.competences)];
    firebase.database().ref('/competences').set(uniqueCompetences);
    this.emitCompetences();
  }

  getCompetences(){
    firebase.database().ref('/competences').on('value', (data: DataSnapshot) => {
      this.competences = data.val() ? data.val().flat() : [];
      this.emitCompetences();
    } );
  }

  constructor() {
    this.getCompetences();
   }



}
