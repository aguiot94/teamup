import { Component, OnInit } from '@angular/core';
import { VerticalHeaderService } from '../../services/vertical-header.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(private verticalHeaderService: VerticalHeaderService) { }

  ngOnInit() {
    this.verticalHeaderService.verticalHeaderIsOpened = false;
    this.verticalHeaderService.emitVerticalHeader();
  }

}
