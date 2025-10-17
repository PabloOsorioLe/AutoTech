import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorTecnicosComponent } from './mantenedor-tecnicos.component';

describe('MantenedorTecnicosComponent', () => {
  let component: MantenedorTecnicosComponent;
  let fixture: ComponentFixture<MantenedorTecnicosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MantenedorTecnicosComponent]
    });
    fixture = TestBed.createComponent(MantenedorTecnicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
