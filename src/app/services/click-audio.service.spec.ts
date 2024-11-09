import { TestBed } from '@angular/core/testing';

import { ClickAudioService } from './click-audio.service';

describe('ClickAudioService', () => {
  let service: ClickAudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClickAudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
