import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPanelComponent } from './common-panel.component';

describe('CommonPanelComponent', () => {
  let component: CommonPanelComponent;
  let fixture: ComponentFixture<CommonPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
