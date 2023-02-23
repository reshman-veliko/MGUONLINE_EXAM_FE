import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvigilatorPageStudentVerificationPopupComponent } from './invigilator-page-student-verification-popup.component';

describe('InvigilatorPageStudentVerificationPopupComponent', () => {
  let component: InvigilatorPageStudentVerificationPopupComponent;
  let fixture: ComponentFixture<InvigilatorPageStudentVerificationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvigilatorPageStudentVerificationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvigilatorPageStudentVerificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
