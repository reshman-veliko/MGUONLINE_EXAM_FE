import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEarlyExamSubmitPopupComponent } from './student-early-exam-submit-popup.component';

describe('StudentEarlyExamSubmitPopupComponent', () => {
  let component: StudentEarlyExamSubmitPopupComponent;
  let fixture: ComponentFixture<StudentEarlyExamSubmitPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentEarlyExamSubmitPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentEarlyExamSubmitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
