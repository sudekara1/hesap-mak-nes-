import { TestBed } from '@angular/core/testing';

import { Calculate } from './calculate.service';

describe('Calculate', () => {
  let service: Calculate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Calculate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
