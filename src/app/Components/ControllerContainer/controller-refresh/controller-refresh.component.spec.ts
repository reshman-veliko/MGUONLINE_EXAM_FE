import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerRefreshComponent } from './controller-refresh.component';

describe('ControllerRefreshComponent', () => {
  let component: ControllerRefreshComponent;
  let fixture: ComponentFixture<ControllerRefreshComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerRefreshComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
