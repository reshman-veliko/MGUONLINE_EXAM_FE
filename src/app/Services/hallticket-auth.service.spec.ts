import { TestBed } from '@angular/core/testing';

import { HallticketAuthService } from './hallticket-auth.service';

describe('HallticketAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HallticketAuthService = TestBed.get(HallticketAuthService);
    expect(service).toBeTruthy();
  });
});
