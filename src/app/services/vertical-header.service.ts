import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class VerticalHeaderService {

  verticalHeaderSubject = new Subject<boolean>();
  verticalHeaderIsOpened = false;
  searchTextSubject = new Subject();
  searchText:string = "";


  constructor() { 
    console.log(this.verticalHeaderIsOpened);
  }

  emitVerticalHeader(){
    this.verticalHeaderSubject.next(this.verticalHeaderIsOpened);
  }

  openVerticalHeader(){
    this.verticalHeaderIsOpened = true;
    this.emitVerticalHeader();
  }

  emitSearchText(){
    this.searchTextSubject.next(this.searchText);
  }
}
