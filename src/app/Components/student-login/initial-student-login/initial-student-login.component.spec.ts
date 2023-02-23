import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialStudentLoginComponent } from './initial-student-login.component';

describe('InitialStudentLoginComponent', () => {
  let component: InitialStudentLoginComponent;
  let fixture: ComponentFixture<InitialStudentLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialStudentLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialStudentLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
