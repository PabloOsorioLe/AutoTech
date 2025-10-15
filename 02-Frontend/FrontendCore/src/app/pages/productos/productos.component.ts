import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService, Producto } from '../../services/producto.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

export interface Categoria {
  categoriaID: number;
  nombreCategoria: string;
  userID?: number;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  cargando: boolean = true;
  productoEditando: Producto | null = null;
  productoForm: FormGroup;
  productos: Producto[] = [];
  productosPaginados: Producto[] = [];
  proveedores: string[] = ['Proveedor A', 'Proveedor B', 'Proveedor C'];
  categorias: Categoria[] = [];
  imagenPreview: string | null = null;
  imagenFile: File | null = null;

  paginaActual: number = 1;
  registrosPorPagina: number = 10;
  totalPaginas: number = 1;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      categoriaID: [null, Validators.required],
      codigo: ['SIN-CODIGO'],
      precio: [990, [Validators.min(0)]],
      stock: [1, [Validators.min(0)]],
      proveedor: ['Proveedor A'],
      ubicacion: ['Bodega'],
      fechaIngreso: [new Date().toISOString().substring(0, 10)],
      descripcion: ['Producto sin descripción']
    });
  }

  ngOnInit(): void {
    this.obtenerCategorias();
    this.obtenerProductos();
  }

  obtenerCategorias(): void {
    this.productoService.getCategorias().subscribe({
      next: (categoriasUnicas: Categoria[]) => {
        // Solo asignar categorías reales, sin opción "Todos"
        this.categorias = categoriasUnicas.filter(c => c !== undefined) as Categoria[];
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
      }
    });
  }

  obtenerProductos(): void {
    this.cargando = true;
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.totalPaginas = Math.ceil(this.productos.length / this.registrosPorPagina);
        this.actualizarPaginacion();
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener los productos',
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
  }

  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    this.productosPaginados = this.productos.slice(inicio, fin);
  }

  cambiarPagina(direccion: 'anterior' | 'siguiente'): void {
    if (direccion === 'anterior' && this.paginaActual > 1) {
      this.paginaActual--;
    } else if (direccion === 'siguiente' && this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
    this.actualizarPaginacion();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.imagenFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getHoyISO(): string {
    return new Date().toISOString().substring(0, 10);
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) return;

    const precioVal = this.productoForm.get('precio')?.value;
    const precioNumerico = typeof precioVal === 'string' ? parseInt(precioVal.replace(/\./g, ''), 10) : precioVal;

 const productoData: Producto = {
  ...this.productoForm.value,
  id: this.productoEditando?.id,
  categoriaID: Number(this.productoForm.value.categoriaID), // conversión aquí
  precio: precioNumerico,
  imagenUrl: this.imagenPreview || undefined,
  estado: 1
};


    const onSuccess = (mensaje: string) => {
      this.paginaActual = 1;
      this.obtenerProductos();
      this.resetFormulario();
      this.cerrarModalYRestaurarScroll();
      Swal.fire({
        icon: 'success',
        title: mensaje,
        showConfirmButton: false,
        timer: 1000
      });
    };

    if (this.productoEditando && this.productoEditando.id) {
      this.productoService.editarProducto(this.productoEditando.id, productoData).subscribe({
        next: () => onSuccess('Actualizado'),
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el producto',
            showConfirmButton: false,
            timer: 1000
          });
        }
      });
    } else {
      this.productoService.agregarProducto(productoData).subscribe({
        next: () => onSuccess('Creado'),
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el producto',
            showConfirmButton: false,
            timer: 1000
          });
        }
      });
    }
  }

  cerrarModalYRestaurarScroll(): void {
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      const modalElement = document.getElementById('modalProducto');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();

      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'auto';

      const backdrops = document.getElementsByClassName('modal-backdrop');
      Array.from(backdrops).forEach(b => b.remove());

      const appRoot = document.querySelector('app-root');
      if (appRoot?.getAttribute('aria-hidden') === 'true') {
        appRoot.removeAttribute('aria-hidden');
      }
    }, 300);
  }

  editarProducto(p: Producto): void {
    this.productoEditando = p;

    const precioFormateado = p.precio.toLocaleString('es-CL');

    this.productoForm.patchValue({
      nombre: p.nombre,
      categoriaID: p.categoriaID,
      codigo: p.codigo,
      precio: precioFormateado,
      stock: p.stock,
      proveedor: p.proveedor,
      ubicacion: p.ubicacion,
      fechaIngreso: p.fechaIngreso ? this.formatFechaISO(p.fechaIngreso) : '',
      descripcion: p.descripcion
    });

    const modal = new bootstrap.Modal(document.getElementById('modalProducto')!);
    modal.show();
  }

  eliminarProducto(producto: Producto): void {
    Swal.fire({
      title: '¿Desactivar producto?',
      text: `El producto "${producto.nombre}" será marcado como inactivo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.productoService.eliminarProducto(producto.id!).subscribe({
          next: () => {
            this.obtenerProductos();
            Swal.fire({
              icon: 'success',
              title: 'Desactivado',
              text: 'Producto desactivado correctamente',
              showConfirmButton: false,
              timer: 1000
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo desactivar el producto',
              showConfirmButton: false,
              timer: 1000
            });
          }
        });
      }
    });
  }

  resetFormulario(): void {
    this.productoForm.reset({
      nombre: '',
      categoriaID: null,
      codigo: 'GEN-001',
      precio: 990,
      stock: 1,
      proveedor: 'Proveedor A',
      ubicacion: 'Bodega Central',
      fechaIngreso: this.getHoyISO(),
      descripcion: ''
    });
    this.imagenFile = null;
    this.imagenPreview = null;
    this.productoEditando = null;
  }

  formatearPrecio(event: any, alPerderFoco = false): void {
    const input = event.target;
    let valor = input.value.replace(/\./g, '').replace(/\D/g, '');

    if (valor === '') {
      input.value = '';
      this.productoForm.get('precio')?.setValue('');
      return;
    }

    const numero = parseInt(valor, 10);
    const formateado = numero.toLocaleString('es-CL');
    input.value = formateado;

    if (alPerderFoco) {
      this.productoForm.get('precio')?.setValue(numero);
    } else {
      this.productoForm.get('precio')?.setValue(formateado);
    }
  }

  verificarStock(): void {
    const valor = this.productoForm.get('stock')?.value;
    if (valor < 0) {
      this.productoForm.get('stock')?.setValue(0);
    }
  }

  formatFechaISO(fecha: string | Date): string {
    const d = new Date(fecha);
    return d.toISOString().substring(0, 10);
  }

  obtenerNombreCategoria(categoriaID: number | null | undefined): string {
    if (!categoriaID) return '';
    const cat = this.categorias.find(c => c.categoriaID === categoriaID);
    return cat ? cat.nombreCategoria : '';
  }
}
