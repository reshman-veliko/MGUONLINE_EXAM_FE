import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerDashboardComponent } from './controller-dashboard.component';

describe('ControllerDashboardComponent', () => {
  let component: ControllerDashboardComponent;
  let fixture: ComponentFixture<ControllerDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
