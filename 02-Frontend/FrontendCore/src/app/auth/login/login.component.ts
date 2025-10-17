import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../interfaces/usuario';
import { timer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit, AfterViewChecked {
  cargandoVisible: boolean = true; // loader visible al inicio
  cargando: boolean = false;       // controla el estado durante login
  usuario: string = '';
  password: string = '';
  mostrarPassword: boolean = false;
  firstFocus: boolean = false;

  @ViewChild('usuarioInput') usuarioInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    console.log('[login] ngOnInit iniciado');
    console.log('[login] backend warmup asincrónico a:', environment.apiUrl);

    // 1️⃣ Llamada al backend asincrónica (no bloquea UI ni loader)
    this.http.get(`${environment.apiUrl}/auth/warmup`).subscribe({
      next: () => console.log('[login] warmup backend completado'),
      error: (err) => console.log('[login] error warmup no crítico:', err)
    });

    // 2️⃣ Loader se mantiene visible 4 segundos y luego desaparece
    timer(4000).subscribe(() => {
      this.cargandoVisible = false;
      console.log('[login] loader oculto tras 4 segundos');
    });
  }

  ngAfterViewInit(): void {
    console.log('[login] ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    // Foco automático al input después de quitar el loader
    if (!this.cargandoVisible && !this.firstFocus && this.usuarioInputRef) {
      this.usuarioInputRef.nativeElement.focus();
      this.firstFocus = true;
      console.log('[login] foco puesto en usuarioInput');
    }
  }

  iniciarSesion(): void {
    console.log('[login] iniciarSesion() usuario:', this.usuario, 'password:', this.password);
    if (!this.usuario || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor, ingrese usuario y contraseña.'
      });
      console.log('[login] campos incompletos');
      return;
    }

    const loginPayload = { rut: this.usuario, password: this.password };
    const authAsAny = this.authService as any;

    if (authAsAny && typeof authAsAny.login === 'function') {
      console.log('[login] autenticando via AuthService');
      authAsAny.login(loginPayload).subscribe({
        next: (res: any) => {
          if (res && res.token) {
            if (typeof authAsAny.guardarToken === 'function') {
              authAsAny.guardarToken(res.token);
            } else {
              sessionStorage.setItem('token', res.token);
            }
          }
          const usuarioLogueado: Usuario = {
            id: 1,
            nombre: this.usuario,
            correo: ''
          };
          this.authService.iniciarSesion(usuarioLogueado);
          this.onLoginSuccess();
        },
        error: (err: any) => {
          this.onLoginError(err);
        }
      });
      return;
    }

    // Llamada directa en caso de no usar AuthService.login
    const url = (environment && environment.apiUrl)
      ? `${environment.apiUrl}/auth/login` : '/auth/login';

    this.http.post<{ token: string }>(url, loginPayload).subscribe({
      next: (res) => {
        if (res && res.token) {
          if (typeof authAsAny.guardarToken === 'function') {
            authAsAny.guardarToken(res.token);
          } else {
            sessionStorage.setItem('token', res.token);
          }
        }
        const usuarioLogueado: Usuario = {
          id: 1,
          nombre: this.usuario,
          correo: ''
        };
        this.authService.iniciarSesion(usuarioLogueado);
        this.onLoginSuccess();
      },
      error: (err) => {
        this.onLoginError(err);
      }
    });
  }

private onLoginSuccess(): void {
  Swal.fire({
    icon: 'success',
    title: '',
    text: '',
    width: 350,
    background: 'rgba(30, 80, 20, 0.85)',
    color: '#99e699',
    iconColor: '#28a745',
    showConfirmButton: false,
    timer: 1200,
    customClass: {
      popup: 'swal2-popup-custom swal2-popup-checkonly'
    },
    didOpen: (popup) => {
      // Oculta el anillo animado SVG si existe
      const ring = popup.querySelector('.swal2-success-ring');
      if (ring) (ring as HTMLElement).style.display = 'none';
      // Alternativamente, oculta todos los hijos SVG menos .swal2-success-line-tip y .swal2-success-line-long
      const svg = popup.querySelector('.swal2-success');
      if (svg) {
        Array.from(svg.children).forEach(child => {
          if (
            !child.classList.contains('swal2-success-line-tip') &&
            !child.classList.contains('swal2-success-line-long')
          ) {
            (child as HTMLElement).style.display = 'none';
          }
        });
      }
    }
  }).then(() => {
    this.ngZone.run(() => {
      this.router.navigate(['/control-movimiento']);
    });
  });
}






  private onLoginError(err: any): void {
    console.log('[login] login ERROR:', err);
    let mensaje = 'Problemas con el servidor.';
    if (err && err.status === 401) mensaje = 'Clave inválida o usuario incorrecto.';
    else if (err && err.status === 404) mensaje = 'Servicio no disponible.';
    else if (err && err.error) {
      if (typeof err.error === 'string') mensaje = err.error;
      else if (err.error.message) mensaje = err.error.message;
    }
    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: mensaje,
      timer: 2000,
      showConfirmButton: false,
      width: 350,
      background: 'rgba(30, 10, 10, 0.85)',
      color: '#ff9999',
      iconColor: '#ff4444',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  }

  scrollToInput(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      console.log('[login] scrollToInput ejecutado', target);
    }, 300);
  }
}
