import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInstructionPopupComponent } from './student-instruction-popup.component';

describe('StudentInstructionPopupComponent', () => {
  let component: StudentInstructionPopupComponent;
  let fixture: ComponentFixture<StudentInstructionPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentInstructionPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentInstructionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
