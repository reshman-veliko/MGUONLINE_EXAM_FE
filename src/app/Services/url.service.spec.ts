import { TestBed } from '@angular/core/testing';

import { URLService } from './url.service';

describe('URLService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: URLService = TestBed.get(URLService);
    expect(service).toBeTruthy();
  });
});
