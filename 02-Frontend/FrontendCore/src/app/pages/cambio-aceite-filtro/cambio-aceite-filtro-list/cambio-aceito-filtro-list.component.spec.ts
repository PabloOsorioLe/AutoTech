import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioAceiteFiltroListComponent } from './cambio-aceite-filtro-list.component';

describe('CambioAceiteFiltroListComponent', () => {
  let component: CambioAceiteFiltroListComponent;
  let fixture: ComponentFixture<CambioAceiteFiltroListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CambioAceiteFiltroListComponent]
    });
    fixture = TestBed.createComponent(CambioAceiteFiltroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
