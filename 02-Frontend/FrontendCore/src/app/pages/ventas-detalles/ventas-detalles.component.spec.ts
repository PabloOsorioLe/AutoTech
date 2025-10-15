import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasDetallesComponent } from './ventas-detalles.component';

describe('VentasDetallesComponent', () => {
  let component: VentasDetallesComponent;
  let fixture: ComponentFixture<VentasDetallesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VentasDetallesComponent]
    });
    fixture = TestBed.createComponent(VentasDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
