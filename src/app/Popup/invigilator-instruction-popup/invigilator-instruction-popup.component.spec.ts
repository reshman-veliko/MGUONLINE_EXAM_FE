import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvigilatorInstructionPopupComponent } from './invigilator-instruction-popup.component';

describe('InvigilatorInstructionPopupComponent', () => {
  let component: InvigilatorInstructionPopupComponent;
  let fixture: ComponentFixture<InvigilatorInstructionPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvigilatorInstructionPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvigilatorInstructionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
