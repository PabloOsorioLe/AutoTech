import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // ajusta si tu path es distinto
import { Usuario } from '../../interfaces/usuario';
import { forkJoin, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  cargando: boolean = true;
  cargandoVisible: boolean = true;
  usuario: string = '';
  password: string = '';
  mostrarPassword: boolean = false;

  @ViewChild('usuarioInput') usuarioInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone,
    private http: HttpClient
  ) { }

ngOnInit(): void {
  console.log('LoginComponent - ngOnInit iniciado');
  
  forkJoin({
    timer: timer(3000), // Simula 3 segundos de loader
    backend: this.http.get(`${environment.apiUrl}/auth/warmup`) // <= Ruta definitiva
  }).subscribe({
    next: () => {
      this.cargando = false;
      this.cargandoVisible = false;
      console.log('LoginComponent - loader y backend completados');
    },
    error: (err) => {
      console.warn('LoginComponent - error en despertar backend', err);
      this.cargando = false;
      this.cargandoVisible = false;
    }
  });
}


  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.usuarioInputRef) {
        this.usuarioInputRef.nativeElement.focus();
        console.log('LoginComponent - foco en input usuario');
      }
    }, 300);
  }

  iniciarSesion(): void {
    console.log('LoginComponent - iniciarSesion llamado con usuario:', this.usuario);

    if (!this.usuario || !this.password) {
      console.warn('LoginComponent - Validación: campos vacíos');
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor, ingrese usuario y contraseña.'
      });
      return;
    }

    this.cargando = true;
    this.cargandoVisible = true;
    console.log('LoginComponent - loader activado y enviando petición login');

    const loginPayload = { rut: this.usuario, password: this.password };
    const authAsAny = this.authService as any;

    if (authAsAny && typeof authAsAny.login === 'function') {
      authAsAny.login(loginPayload).subscribe({
        next: (res: any) => {
          if (res && res.token) {
            if (typeof authAsAny.guardarToken === 'function') {
              authAsAny.guardarToken(res.token);
            } else {
              sessionStorage.setItem('token', res.token);
            }
            console.log('LoginComponent - token guardado via authService.login', res.token);
          }

          // Emitir usuario al BehaviorSubject de AuthService
          const usuarioLogueado: Usuario = {
            id: 1,
            nombre: this.usuario,
            correo: '' // o un correo real si lo tienes
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

    // Si no hay login en AuthService, hacemos la petición HTTP directamente
    const url = (environment && environment.apiUrl) ? `${environment.apiUrl}/auth/login` : '/auth/login';

    this.http.post<{ token: string }>(url, loginPayload).subscribe({
      next: (res) => {
        console.log('LoginComponent - respuesta HTTP login:', res);
        if (res && res.token) {
          if (typeof authAsAny.guardarToken === 'function') {
            authAsAny.guardarToken(res.token);
            console.log('LoginComponent - token guardado via authService.guardarToken');
          } else {
            sessionStorage.setItem('token', res.token);
            console.log('LoginComponent - token guardado en sessionStorage (fallback)');
          }
        }

        // Emitir usuario al BehaviorSubject de AuthService
        const usuarioLogueado: Usuario = {
          id: 1,
          nombre: this.usuario,
          correo: ''  // si no lo tienes, puedes dejar vacío temporalmente
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
    this.fadeOut(() => {
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
          console.log('LoginComponent - navegación a /productos después de login');
        });
      });
    });
  }

  private onLoginError(err: any): void {
    console.error('LoginComponent - error login:', err);
    this.fadeOut(() => {
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
    });
  }

  fadeOut(callback: () => void) {
    console.log('LoginComponent - fadeOut activado');
    this.cargandoVisible = false;
    setTimeout(() => {
      this.cargando = false;
      console.log('LoginComponent - fadeOut completado');
      callback();
    }, 500);
  }

  scrollToInput(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      console.log('LoginComponent - scrollToInput ejecutado');
    }, 300);
  }
}
