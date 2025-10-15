import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';
import { Usuario } from './interfaces/usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  mostrarLayout: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Observa cambios de navegación
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.actualizarLayout();
      });

    // Observa cambios de autenticación en tiempo real
    this.authService.usuarioActual$.subscribe(() => {
      this.actualizarLayout();
    });

    // Inicializa layout al cargar la app
    this.actualizarLayout();
  }

  actualizarLayout() {
    const usuario: Usuario | null = this.authService.obtenerUsuarioActual();
    const enLogin = this.router.url.includes('/login');
    this.mostrarLayout = !!usuario && !enLogin;

    console.log('AppComponent -> actualizarLayout');
    console.log('Usuario actual:', usuario);
    console.log('URL actual:', this.router.url);
    console.log('mostrarLayout:', this.mostrarLayout);
  }
}
