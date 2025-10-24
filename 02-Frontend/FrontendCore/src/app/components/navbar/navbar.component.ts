import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuVisible = true;
  iconoActual = 'bi-house'; // Icono por defecto
  tituloActual = 'Inicio';  // Título por defecto

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.actualizarTituloYIcono(event.urlAfterRedirects);
      }
    });
  }

  cerrarSesion(event: Event): void {
    event.preventDefault();
    this.authService.cerrarSesion();
  }

  cerrarMenu() {
    const navbar = document.getElementById('navbarNav');
    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }

  toggleMenu() {
    const navbar = document.getElementById('navbarNav');
    if (navbar) {
      navbar.classList.toggle('show');
    }
  }
actualizarTituloYIcono(url: string) {
  if (url.startsWith('/control-movimiento')) {
    this.tituloActual = 'Control de Movimiento';
    this.iconoActual = 'bi-bar-chart-steps';
  } else if (url.startsWith('/mantenedor-tecnicos')) {
    this.tituloActual = 'Mantenedor de Técnicos';
    this.iconoActual = 'bi-person-lines-fill';
  } else if (url.startsWith('/trabajos')) {
    this.tituloActual = 'Mantenedor de Trabajos';
    this.iconoActual = 'bi-clipboard-data';
  } else if (url.startsWith('/cambio-aceite-filtro')) {
    this.tituloActual = 'Aceite & Filtro';
    this.iconoActual = 'bi-droplet-half';
  } else if (url.startsWith('/resumen-semanal')) {
    this.tituloActual = 'Resumen Semanal';
    this.iconoActual = 'bi-calendar2-week';
  } else {
    this.tituloActual = 'Inicio';
    this.iconoActual = 'bi-house';
  }
}

}
