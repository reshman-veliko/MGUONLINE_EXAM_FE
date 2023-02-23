import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvigilatorEarlyExamResponsePopupComponent } from './invigilator-early-exam-response-popup.component';

describe('InvigilatorEarlyExamResponsePopupComponent', () => {
  let component: InvigilatorEarlyExamResponsePopupComponent;
  let fixture: ComponentFixture<InvigilatorEarlyExamResponsePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvigilatorEarlyExamResponsePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvigilatorEarlyExamResponsePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
