import { TestBed } from '@angular/core/testing';

import { CambioAceiteFiltroService } from './cambio-aceite-filtro.service';

describe('CambioAceiteFiltroService', () => {
  let service: CambioAceiteFiltroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CambioAceiteFiltroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
