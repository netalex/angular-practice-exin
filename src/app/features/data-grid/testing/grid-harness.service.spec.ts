import { TestBed } from '@angular/core/testing';

import { GridHarnessService } from './grid-harness.service';

describe('GridHarnessService', () => {
  let service: GridHarnessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridHarnessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
