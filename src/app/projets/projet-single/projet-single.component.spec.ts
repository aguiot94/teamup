import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetSingleComponent } from './projet-single.component';

describe('ProjetSingleComponent', () => {
  let component: ProjetSingleComponent;
  let fixture: ComponentFixture<ProjetSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjetSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjetSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
