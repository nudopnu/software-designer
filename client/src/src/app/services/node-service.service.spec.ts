import { TestBed } from '@angular/core/testing';

import { NodeService } from './node-service.service';

describe('NodeServiceService', () => {
  let service: NodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
