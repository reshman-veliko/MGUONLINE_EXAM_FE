import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomImagePopupComponent } from './random-image-popup.component';

describe('RandomImagePopupComponent', () => {
  let component: RandomImagePopupComponent;
  let fixture: ComponentFixture<RandomImagePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomImagePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomImagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
