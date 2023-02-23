import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerLoginComponent } from './controller-login.component';

describe('ControllerLoginComponent', () => {
  let component: ControllerLoginComponent;
  let fixture: ComponentFixture<ControllerLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
