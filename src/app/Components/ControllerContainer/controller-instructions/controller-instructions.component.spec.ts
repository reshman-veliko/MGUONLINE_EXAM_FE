import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerInstructionsComponent } from './controller-instructions.component';

describe('ControllerInstructionsComponent', () => {
  let component: ControllerInstructionsComponent;
  let fixture: ComponentFixture<ControllerInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
