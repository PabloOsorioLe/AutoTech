import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ProductoService, Producto, Categoria } from '../../services/producto.service';
import { VentaService } from '../../services/venta.service';
import Swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';


declare var bootstrap: any;

interface CarritoItem {
  id?: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface Pago {
  metodo: string;
  monto: number;
}

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
  providers: [CurrencyPipe]
})
export class VentasComponent implements OnInit, AfterViewChecked {
  @ViewChild('montoPagoInput') montoPagoInput!: ElementRef;
  @ViewChild('montoInput') montoInput!: ElementRef;

  alertaStock: string = '';
  productosCriticos: { nombre: string; stock: number }[] = [];
  mostrarAlertaStock: boolean = false;


  productos: Producto[] = [];
  categorias: Categoria[] = [];
  categoriaSeleccionada: Categoria | null = null;

  carrito: CarritoItem[] = [];
  total: number = 0;
  lastAddedProductId: string | null = null;

  montoPersonalizado: number = 0;
  montoPersonalizadoFormatted: string = '';
  descripcionPersonalizada: string = 'Producto';

  pagos: Pago[] = [];
  montoPago: number = 0;
  montoPagoFormatted: string = '';
  metodoPago: string = 'efectivo';
  restante: number = 0;
  vuelto: number = 0;

  mostrarConfirmacionPago: boolean = false;
  loadingVenta: boolean = false;

  

  constructor(
    private productoService: ProductoService,
    private ventaService: VentaService,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewChecked(): void {
    const modalEl = document.getElementById('modalMonto');
    const modalVisible = modalEl?.classList.contains('show');
    if (modalVisible && (this.montoPersonalizadoFormatted === '' || this.montoPersonalizadoFormatted === '$0')) {
      this.montoInput.nativeElement.focus();
      this.montoInput.nativeElement.select();
    }
  }

obtenerProductos(): void {
  this.productoService.getProductos().subscribe({
    next: (data) => {
      this.productos = data.filter(p => p.estado === 1);
      this.obtenerCategoriasUnicas();
      if (!this.categoriaSeleccionada) {
        this.categoriaSeleccionada = { categoriaID: 0, nombreCategoria: 'Todos' };
      }

      // Detectar productos críticos
      const bajos = this.productos.filter(p => p.stock > 0 && p.stock < 5);
      if (bajos.length > 0) {
        this.productosCriticos = bajos.map(p => ({
          nombre: p.nombre,
          stock: p.stock,
        }));
        this.mostrarAlertaStock = true;
        setTimeout(() => (this.mostrarAlertaStock = false), 3200);
      }
    },
    error: (err) => {
      const errorMsg = err.error || 'No se pudieron cargar los productos. Verifica la conexión con el servidor.';
      Swal.fire('Error', errorMsg, 'error');
    }
  });
}



  obtenerCategoriasUnicas(): void {
    const categoriasMap = new Map<number, Categoria>();
    for (const p of this.productos) {
      if (p.categoriaID && !categoriasMap.has(p.categoriaID)) {
        const nombreCat = typeof p.categoria === 'string' ? p.categoria : p.categoria?.nombreCategoria || '';
        categoriasMap.set(p.categoriaID, { categoriaID: p.categoriaID, nombreCategoria: nombreCat });
      }
    }
    const categoriaTodos: Categoria = { categoriaID: 0, nombreCategoria: 'Todos' };
    this.categorias = [categoriaTodos, ...Array.from(categoriasMap.values())];
  }

  seleccionarCategoria(cat: Categoria): void {
    this.categoriaSeleccionada = cat;
  }

get productosFiltrados(): Producto[] {
  if (!this.categoriaSeleccionada || this.categoriaSeleccionada.categoriaID === 0) {
    return this.productos.filter(p => p.stock > 0);
  }
  return this.productos.filter(
    p => p.categoriaID === this.categoriaSeleccionada!.categoriaID && p.stock > 0
  );
}


  incrementarCantidad(index: number): void {
    const item = this.carrito[index];
    if (!item) return;
    const prod = this.productos.find(p => p.id === item.id);
    if (prod && prod.stock < item.cantidad + 1) {
      Swal.fire('Error', `Stock insuficiente para ${prod.nombre}. Stock disponible: ${prod.stock}`, 'error');
      return;
    }
    item.cantidad += 1;
    this.calcularTotal();
  }

  eliminarDelCarrito(index: number): void {
    this.carrito.splice(index, 1);
    this.calcularTotal();
  }

  eliminarPago(index: number): void {
    this.pagos.splice(index, 1);
    this.calcularRestante();
  }

  abrirModalMontoPersonalizado(): void {
    this.montoPersonalizado = 0;
    this.montoPersonalizadoFormatted = '';
    this.descripcionPersonalizada = 'Producto';
    const modal = new bootstrap.Modal(document.getElementById('modalMonto')!);
    modal.show();
    setTimeout(() => {
      this.montoInput.nativeElement.focus();
      this.montoInput.nativeElement.select();
    }, 200);
  }

  abrirModalPagos(): void {
    this.montoPago = 0;
    this.montoPagoFormatted = '$0';
    this.metodoPago = 'efectivo';
    const modalElement = document.getElementById('modalPagos');
    if (!modalElement) return;
    const modal = new bootstrap.Modal(modalElement);
    modalElement.addEventListener('shown.bs.modal', () => {
      this.montoPagoInput.nativeElement.focus();
      this.montoPagoInput.nativeElement.select();
    }, { once: true });
    modal.show();
  }

  finalizarVenta(): void {
    if (this.carrito.length === 0) {
      Swal.fire('Error', 'El carrito está vacío', 'error');
      return;
    }
    const totalPagado = this.pagos.reduce((sum, pago) => sum + pago.monto, 0);
    if (totalPagado < this.total) {
      Swal.fire({
        icon: 'warning',
        title: 'Pago incompleto',
        html: `
          <p><strong>Total:</strong> $${this.total.toLocaleString('es-CL')}</p>
          <p><strong>Restante:</strong> $${(this.total - totalPagado).toLocaleString('es-CL')}</p>
          <p>Aún queda saldo por pagar.</p>
        `,
        confirmButtonText: 'OK'
      });
      return;
    }
    this.vuelto = totalPagado - this.total;
    this.loadingVenta = true;
    const data = {
      total: this.total,
      carrito: this.carrito.map(item => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad
      })),
      pagos: this.pagos
    };
    this.ventaService.crearVenta(data).subscribe({
      next: () => {
        this.loadingVenta = false;
        Swal.fire('Venta realizada', 'La venta fue procesada con éxito', 'success');
        this.carrito = [];
        this.total = 0;
        this.pagos = [];
        this.restante = 0;
        this.lastAddedProductId = null;
        this.obtenerProductos();
      },
      error: (err) => {
        this.loadingVenta = false;
        const errorMsg = err.error || 'Error al procesar la venta. Verifica stock o conexión.';
        Swal.fire('Error', errorMsg, 'error');
      }
    });
  }

  onInputMontoPersonalizado(event: any): void {
    const input = event.target as HTMLInputElement;
    let rawValue = input.value.replace(/[^\d]/g, '');

    if (rawValue.length === 0) {
      this.montoPersonalizadoFormatted = '';
      this.montoPersonalizado = 0;
      input.value = '';
      return;
    }

    const numericValue = parseInt(rawValue, 10);
    this.montoPersonalizado = numericValue;
    const formattedValue = new Intl.NumberFormat('es-CL').format(numericValue);

    input.value = formattedValue;
    this.montoPersonalizadoFormatted = formattedValue;
  }

  onEnterMonto(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.agregarMontoPersonalizado();
    }
  }

  agregarMontoPersonalizado(): void {
    if (this.montoPersonalizado <= 0) {
      Swal.fire('Error', 'El monto debe ser mayor a 0', 'error');
      return;
    }
    this.carrito.push({
      nombre: this.descripcionPersonalizada || 'Monto personalizado',
      precio: this.montoPersonalizado,
      cantidad: 1
    });
    this.calcularTotal();
    this.montoPersonalizado = 0;
    this.montoPersonalizadoFormatted = '';
    this.descripcionPersonalizada = 'Producto';
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalMonto')!);
    modal?.hide();
  }

  formatMontoPago(value: string): void {
    const numericValue = value.replace(/[^0-9]/g, '');
    this.montoPago = numericValue ? parseInt(numericValue, 10) : 0;
    this.montoPagoFormatted = this.currencyPipe.transform(this.montoPago, 'CLP', 'symbol', '1.0-0') || '$0';
    this.calcularRestante();
  }

  agregarPago(): void {
    if (this.montoPago <= 0) {
      Swal.fire('Error', 'El monto debe ser mayor a 0', 'error');
      return;
    }
    const existingPago = this.pagos.find(p => p.metodo === this.metodoPago);
    if (existingPago) {
      existingPago.monto += this.montoPago;
    } else {
      this.pagos.push({ metodo: this.metodoPago, monto: this.montoPago });
    }
    this.calcularRestante();
    this.mostrarConfirmacionPago = true;
    setTimeout(() => this.mostrarConfirmacionPago = false, 2000);
    this.montoPago = 0;
    this.montoPagoFormatted = '$0';
    setTimeout(() => {
      if (this.montoPagoInput) {
        this.montoPagoInput.nativeElement.focus();
        this.montoPagoInput.nativeElement.select();
      }
    }, 100);
  }

  resetPago(): void {
    this.montoPago = 0;
    this.montoPagoFormatted = '$0';
    this.metodoPago = 'efectivo';
  }

  calcularTotal(): void {
    this.total = this.carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    this.calcularRestante();
  }

  calcularRestante(): void {
    const pagado = this.pagos.reduce((sum, p) => sum + p.monto, 0);
    this.restante = this.total - pagado;
  }

  agregarAlCarrito(producto: Producto): void {
  if (producto.stock <= 0) {
    Swal.fire('Error', 'Producto sin stock', 'error');
    return;
  }
  const existingItem = this.carrito.find(item => item.id === producto.id);
  if (existingItem) {
    if (producto.stock < existingItem.cantidad + 1) {
      Swal.fire('Error', `Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stock}`, 'error');
      return;
    }
    existingItem.cantidad += 1;
  } else {
    this.carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
  }
  this.lastAddedProductId = `${producto.nombre}-${producto.precio}`;
  this.calcularTotal();
  setTimeout(() => this.clearLastAddedHighlight(), 2000);
}

getCantidadEnCarrito(productoId: number | undefined): number {
  if (!productoId) return 0;
  const item = this.carrito.find(i => i.id === productoId);
  return item ? item.cantidad : 0;
}

decrementarCantidad(index: number): void {
  if (this.carrito[index].cantidad > 1) {
    this.carrito[index].cantidad -= 1;
    this.calcularTotal();
  }
}

clearLastAddedHighlight(): void {
  this.lastAddedProductId = null;
}


}
