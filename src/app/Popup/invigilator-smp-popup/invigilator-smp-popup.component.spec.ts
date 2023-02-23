import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvigilatorSMPPopupComponent } from './invigilator-smp-popup.component';

describe('InvigilatorSMPPopupComponent', () => {
  let component: InvigilatorSMPPopupComponent;
  let fixture: ComponentFixture<InvigilatorSMPPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvigilatorSMPPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvigilatorSMPPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
