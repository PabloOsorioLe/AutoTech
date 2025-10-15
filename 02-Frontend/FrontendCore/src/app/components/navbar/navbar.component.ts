// src/app/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuVisible = true;
  iconoActual = 'bi-house'; // Icono por defecto
  tituloActual = 'Inicio';  // Título por defecto

  constructor(private authService: AuthService) {}

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
}
