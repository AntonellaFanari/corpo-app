import { TestBed } from '@angular/core/testing';

import { ResultsWodGroupMemberService } from './results-wod-group-member.service';

describe('ResultsWodGroupMemberService', () => {
  let service: ResultsWodGroupMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultsWodGroupMemberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
