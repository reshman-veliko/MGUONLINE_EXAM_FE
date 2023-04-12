import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamPauseComponent } from './exam-pause.component';

describe('ExamPauseComponent', () => {
  let component: ExamPauseComponent;
  let fixture: ComponentFixture<ExamPauseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamPauseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamPauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
