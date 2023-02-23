import { TestBed, async, inject } from '@angular/core/testing';

import { ControllerLoginGuard } from './controller-login.guard';

describe('ControllerLoginGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ControllerLoginGuard]
    });
  });

  it('should ...', inject([ControllerLoginGuard], (guard: ControllerLoginGuard) => {
    expect(guard).toBeTruthy();
  }));
});
