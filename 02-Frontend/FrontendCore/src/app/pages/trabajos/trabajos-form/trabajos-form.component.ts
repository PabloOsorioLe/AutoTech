import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrabajosService } from '../trabajos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Trabajo } from '../trabajos.model';

@Component({
  selector: 'app-trabajos-form',
  templateUrl: './trabajos-form.component.html',
  styleUrls: ['./trabajos-form.component.css'] // ✅ Agrega esta línea
})
export class TrabajosFormComponent implements OnInit {
  form!: FormGroup;
  esEdicion = false;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private trabajosService: TrabajosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.esEdicion = !!this.id;
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: ['Pendiente', Validators.required],
      fechaInicio: [new Date(), Validators.required],
      fechaFin: [null]
    });

    if (this.esEdicion) {
      this.trabajosService.getById(this.id).subscribe(data => {
        this.form.patchValue(data);
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) return;
    const trabajo: Trabajo = { ...this.form.value, id: this.id };

    if (this.esEdicion) {
      this.trabajosService.update(trabajo).subscribe(() => {
        this.router.navigate(['/trabajos']);
      });
    } else {
      this.trabajosService.create(trabajo).subscribe(() => {
        this.router.navigate(['/trabajos']);
      });
    }
  }
}
