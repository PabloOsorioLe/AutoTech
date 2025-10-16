import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../interfaces/usuario';
import { forkJoin, timer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit, AfterViewChecked {
  cargandoVisible: boolean = true; // sólo para loader visual
  cargando: boolean = false;       // nunca bloquea controles
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
    console.log('[login] ngOnInit');
    console.log('[login] antes del forkJoin:', environment.apiUrl);

    forkJoin({
      timer: timer(1500),
      backend: this.http.get(`${environment.apiUrl}/auth/warmup`)
    }).subscribe({
      next: () => {
        this.cargandoVisible = false;
        console.log('[login] loader terminado, se muestra input y btn: cargandoVisible =', this.cargandoVisible);
        console.log('[login] cargandoVisible =', this.cargandoVisible);

      },
      error: (err) => {
        this.cargandoVisible = false;
        console.log('[login] error backend warmup loader, cargandoVisible =', this.cargandoVisible, err);
        console.log('[login] cargandoVisible =', this.cargandoVisible);

      }
    });
  }

  ngAfterViewInit(): void {
    console.log('[login] ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    // Solo tratar de enfocar si el loader ya desapareció y hay input
    if (!this.cargandoVisible && !this.firstFocus && this.usuarioInputRef) {
      this.usuarioInputRef.nativeElement.focus();
      this.firstFocus = true;
      console.log('[login] AfterViewChecked: foco puesto a usuarioInput');
      console.log('[login] usuarioInput.disabled:', this.usuarioInputRef.nativeElement.disabled);
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
      console.log('[login] campos incompletos, usuario:', this.usuario, 'password:', this.password);
      return;
    }
    // Nunca cambia cargando, nunca bloquea controles
    const loginPayload = { rut: this.usuario, password: this.password };
    const authAsAny = this.authService as any;

    if (authAsAny && typeof authAsAny.login === 'function') {
      console.log('[login] login via AuthService');
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
    console.log('[login] login OK');
    Swal.fire({
      icon: 'success',
      title: 'Bienvenido/a',
      showConfirmButton: false,
      timer: 1500,
      background: 'rgba(24, 24, 24, 0.85)',
      color: '#99caff',
      iconColor: '#28a745',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom'
      }
    }).then(() => {
      this.ngZone.run(() => {
        this.router.navigate(['/productos']);
      });
    });
  }

  private onLoginError(err: any): void {
    console.log('[login] login ERROR, err:', err);
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
