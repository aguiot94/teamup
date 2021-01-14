import { TestBed } from '@angular/core/testing';

import { VerticalHeaderService } from './vertical-header.service';

describe('VerticalHeaderService', () => {
  let service: VerticalHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerticalHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
