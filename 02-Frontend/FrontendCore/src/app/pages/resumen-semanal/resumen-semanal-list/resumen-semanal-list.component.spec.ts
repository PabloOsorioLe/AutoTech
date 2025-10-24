import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenSemanalListComponent } from './resumen-semanal-list.component';

describe('ResumenSemanalListComponent', () => {
  let component: ResumenSemanalListComponent;
  let fixture: ComponentFixture<ResumenSemanalListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResumenSemanalListComponent]
    });
    fixture = TestBed.createComponent(ResumenSemanalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
