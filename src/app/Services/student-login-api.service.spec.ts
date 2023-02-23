import { TestBed } from '@angular/core/testing';

import { StudentLoginAPIService } from './student-login-api.service';

describe('StudentLoginAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudentLoginAPIService = TestBed.get(StudentLoginAPIService);
    expect(service).toBeTruthy();
  });
});
