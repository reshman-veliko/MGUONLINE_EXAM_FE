import { TestBed } from '@angular/core/testing';

import { ControllerAPIService } from './controller-api.service';

describe('ControllerAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ControllerAPIService = TestBed.get(ControllerAPIService);
    expect(service).toBeTruthy();
  });
});
