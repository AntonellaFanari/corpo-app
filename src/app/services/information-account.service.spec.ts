import { TestBed } from '@angular/core/testing';

import { InformationAccountService } from './information-account.service';

describe('InformationAccountService', () => {
  let service: InformationAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
