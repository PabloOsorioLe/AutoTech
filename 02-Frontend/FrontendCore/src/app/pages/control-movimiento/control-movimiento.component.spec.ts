import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlMovimientoComponent } from './control-movimiento.component';

describe('ControlMovimientoComponent', () => {
  let component: ControlMovimientoComponent;
  let fixture: ComponentFixture<ControlMovimientoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ControlMovimientoComponent]
    });
    fixture = TestBed.createComponent(ControlMovimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
