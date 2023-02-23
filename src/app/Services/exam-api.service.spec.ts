import { TestBed } from '@angular/core/testing';

import { ExamAPIService } from './exam-api.service';

describe('ExamAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExamAPIService = TestBed.get(ExamAPIService);
    expect(service).toBeTruthy();
  });
});
