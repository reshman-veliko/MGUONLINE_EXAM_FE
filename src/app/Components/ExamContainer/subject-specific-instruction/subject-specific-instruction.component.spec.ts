import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectSpecificInstructionComponent } from './subject-specific-instruction.component';

describe('SubjectSpecificInstructionComponent', () => {
  let component: SubjectSpecificInstructionComponent;
  let fixture: ComponentFixture<SubjectSpecificInstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectSpecificInstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectSpecificInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
