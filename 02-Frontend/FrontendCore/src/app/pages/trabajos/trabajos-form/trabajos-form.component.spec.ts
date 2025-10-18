import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajosFormComponent } from './trabajos-form.component';

describe('TrabajosFormComponent', () => {
  let component: TrabajosFormComponent;
  let fixture: ComponentFixture<TrabajosFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrabajosFormComponent]
    });
    fixture = TestBed.createComponent(TrabajosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
