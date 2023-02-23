import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvigilatorOTPPopupComponent } from './invigilator-otppopup.component';

describe('InvigilatorOTPPopupComponent', () => {
  let component: InvigilatorOTPPopupComponent;
  let fixture: ComponentFixture<InvigilatorOTPPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvigilatorOTPPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvigilatorOTPPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
