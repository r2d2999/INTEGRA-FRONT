import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SessionService } from '../../auth/session.service';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  isMenuOpen = false;

  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private sessionService: SessionService) {}

  async ngOnInit(): Promise<void> {
    await this.checkAuthStatus(); // Verifica el estado de autenticación al iniciar
    console.log("navbar says Initial value:", this.isLoggedIn);

    if (this.isLoggedIn) {
      this.sessionService.startSessionTimerP(); // Iniciar el temporizador si el usuario está autenticado
    }
  }

  async checkAuthStatus(): Promise<void> {
    this.isLoggedIn = await this.authService.isAuthenticated2(); // Asegúrate de que este método devuelva una promesa
    console.log("authService says, logged: ", this.isLoggedIn);
  }

  logout(): void {
    this.authService.logout(); // Llama al método de cierre de sesión
    this.sessionService.logout();
    this.checkAuthStatus(); // Actualiza el estado
  }




  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
