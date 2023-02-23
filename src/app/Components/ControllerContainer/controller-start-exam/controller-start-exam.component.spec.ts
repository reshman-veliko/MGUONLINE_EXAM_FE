import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerStartExamComponent } from './controller-start-exam.component';

describe('ControllerStartExamComponent', () => {
  let component: ControllerStartExamComponent;
  let fixture: ComponentFixture<ControllerStartExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerStartExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerStartExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
