import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentverificationpopupComponent } from './studentverificationpopup.component';

describe('StudentverificationpopupComponent', () => {
  let component: StudentverificationpopupComponent;
  let fixture: ComponentFixture<StudentverificationpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentverificationpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentverificationpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
