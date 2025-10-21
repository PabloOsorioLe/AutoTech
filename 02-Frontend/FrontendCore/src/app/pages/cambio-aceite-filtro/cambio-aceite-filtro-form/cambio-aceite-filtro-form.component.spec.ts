import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioAceiteFiltroFormComponent } from './cambio-aceite-filtro-form.component';

describe('CambioAceiteFiltroFormComponent', () => {
  let component: CambioAceiteFiltroFormComponent;
  let fixture: ComponentFixture<CambioAceiteFiltroFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CambioAceiteFiltroFormComponent]
    });
    fixture = TestBed.createComponent(CambioAceiteFiltroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
