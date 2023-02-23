import { TestBed, async, inject } from '@angular/core/testing';

import { HallticketAuthGuard } from './hallticket-auth.guard';

describe('HallticketAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HallticketAuthGuard]
    });
  });

  it('should ...', inject([HallticketAuthGuard], (guard: HallticketAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
