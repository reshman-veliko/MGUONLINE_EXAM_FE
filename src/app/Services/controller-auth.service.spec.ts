import { TestBed } from '@angular/core/testing';

import { ControllerAuthService } from './controller-auth.service';

describe('ControllerAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ControllerAuthService = TestBed.get(ControllerAuthService);
    expect(service).toBeTruthy();
  });
});
