import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvigilatorExamSummaryComponent } from './invigilator-exam-summary.component';

describe('InvigilatorExamSummaryComponent', () => {
  let component: InvigilatorExamSummaryComponent;
  let fixture: ComponentFixture<InvigilatorExamSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvigilatorExamSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvigilatorExamSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
