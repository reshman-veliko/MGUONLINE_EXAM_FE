import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HallticketPopupComponent } from './hallticket-popup.component';

describe('HallticketPopupComponent', () => {
  let component: HallticketPopupComponent;
  let fixture: ComponentFixture<HallticketPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HallticketPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HallticketPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
