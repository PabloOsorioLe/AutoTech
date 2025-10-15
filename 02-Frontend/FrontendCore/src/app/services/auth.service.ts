import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioActualSubject = new BehaviorSubject<Usuario | null>(null);
  usuarioActual$: Observable<Usuario | null> = this.usuarioActualSubject.asObservable();

  constructor(private router: Router) {
    const usuarioGuardado = sessionStorage.getItem('usuarioActual');
    if (usuarioGuardado) {
      this.usuarioActualSubject.next(JSON.parse(usuarioGuardado));
    }
  }

iniciarSesion(usuario: Usuario) {
  sessionStorage.setItem('usuarioActual', JSON.stringify(usuario));
  this.usuarioActualSubject.next(usuario); // <-- esto es lo que notifica a los suscriptores
  console.log('AuthService -> usuarioActualSubject emitido', usuario);
}


cerrarSesion() {
  sessionStorage.removeItem('usuarioActual');
  this.usuarioActualSubject.next(null);
  this.router.navigate(['/auth/login']).then(() => {
    window.location.reload(); // esto fuerza el borrado de historial de la SPA
  });
}


  obtenerUsuarioActual(): Usuario | null {
    return this.usuarioActualSubject.value;
  }

  
}
