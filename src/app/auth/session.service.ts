import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private timeoutId: any;
  private loggedOut: boolean = false;
  public isLoggedIn: any;

  public timer: number = 10000;


  constructor(private router: Router, private authService:AuthService) {}



  async startSessionTimerP() {
    await this.checkAuthStatus(); // Asegúrate de que esto se resuelva antes de continuar
  
    if (this.isLoggedIn) {
      console.log("SERVICES IS ACTIVO");
      // Aquí puedes iniciar el temporizador
          this.resetTimer();

    } else {
      console.log("SERVICE IS NO ACTIVO");
      // Tal vez quieras detener el temporizador o no hacer nada
    }
  }
  
  async checkAuthStatusP(): Promise<void> {
    this.isLoggedIn = await this.authService.isAuthenticated2(); // Asegúrate de que esto sea asíncrono
    console.log("authService says, logged: ", this.isLoggedIn);
  }
 

  startSessionTimer() {
    this.checkAuthStatus();

    if(this.isLoggedIn){
      console.log("SERVICES IS ACTIVO");
    }else {
      console.log("SERVICE IS NO ACTIVO");

    }


    /*
    console.log("ST", this.loggedOut);
    //if (this.loggedOut) return; // No iniciar si ya ha cerrado sesión
    if(this.loggedOut === true){
      console.log("se activo");
    }else if(this.loggedOut === false){
      console.log("se desactivo");

    }
      */
 


    //this.resetTimer();
}



async checkAuthStatus(): Promise<void> {
  this.isLoggedIn = await this.authService.isAuthenticated2();
  console.log("authService says, logged: ", this.isLoggedIn);
}


resetTimer() {

  
  console.log("+",this.timer);

    this.clearSessionTimer(); // Limpia cualquier temporizador anterior
    this.timeoutId = setTimeout(() => {
        this.showSessionExpiredAlert();
    }, this.timer); // Ajusta a 20 segundos o el tiempo deseado

    this.timer +=1000;
}

  clearSessionTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  showSessionExpiredAlert() {
    if (this.loggedOut) return; // Si ya ha cerrado sesión, no mostrar el alert

    const secondsRemaining = this.timer / 1000; 
    const message = `Tu tiempo de sesión ha terminado. ¿Deseas continuar con ${secondsRemaining} segundos adicionales?`;

    Swal.fire({
      icon: 'warning',
      title: 'Sesión Expirada',
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: 'green',
      cancelButtonColor: 'red',
      allowOutsideClick: false 

    }).then((result) => {
      if (result.isConfirmed) {
        
        this.resetTimer(); 
        console.log("REINICIANDO TIMER");
      } else {
        this.timer = 10000;
        this.logout(); 
      }
    });
}



  stopTimer() {
    clearTimeout(this.timeoutId); // Cambiar a this.timeoutId
    this.timeoutId = null; // Asegúrate de que el temporizador se reinicie
    this.timer = 10000;
  }

  async stopTimer2(): Promise<void> {
    return new Promise((resolve) => {
      clearTimeout(this.timeoutId); // Detener el temporizador
      this.timeoutId = null; // Asegúrate de que el temporizador se reinicie
      resolve(); // Resuelve la promesa después de realizar la acción
    });
  }
  

  logout() {
    console.log("Apagando sesión...");
    this.stopTimer(); // Detener el temporizador
    //this.loggedOut = true; // Marcar que el usuario ha cerrado sesión
    localStorage.removeItem('user'); 
    this.isLoggedIn = false;
    localStorage.removeItem('loginTime'); 
    this.router.navigate(['/login']);
}


async logout2(): Promise<void> {
  return new Promise((resolve) => {
    this.stopTimer2(); // Detener el temporizador
    this.loggedOut = true; // Marcar que el usuario ha cerrado sesión
    console.log("Cerrando sesión...");

    localStorage.removeItem('user'); 
    localStorage.removeItem('loginTime'); 
    
    this.router.navigate(['/login']);
    
    resolve(); // Resuelve la promesa después de realizar la acción
  });
}


}
