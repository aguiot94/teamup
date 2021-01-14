import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { VerticalHeaderService } from '../../services/vertical-header.service';

@Component({
  selector: 'app-vertical-header',
  templateUrl: './vertical-header.component.html',
  styleUrls: ['./vertical-header.component.css']
})
export class VerticalHeaderComponent implements OnInit {

  constructor(private router: Router,
              private verticalHeaderService: VerticalHeaderService) { }

  @Output() searchTextEvent = new EventEmitter<string>();

  searchText:string = "";
  checkboxIsChecked:boolean = false;

  onSearchTextChange(){
    this.verticalHeaderService.searchText = this.searchText;
    this.verticalHeaderService.emitSearchText();
  }

  checkboxValue($event){
    if(!this.checkboxIsChecked){
      this.checkboxIsChecked = true;
      this.searchText = $event.target.name;
    } else {
      this.checkboxIsChecked = false;
      this.searchText = "";
    }
    
    this.onSearchTextChange();
  }

  ngOnInit(): void {
  }

}
