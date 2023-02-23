import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonInstructionsComponent } from './common-instructions.component';

describe('CommonInstructionsComponent', () => {
  let component: CommonInstructionsComponent;
  let fixture: ComponentFixture<CommonInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
