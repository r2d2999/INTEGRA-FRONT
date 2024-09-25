import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SubjectsComponent } from '../../professor/subjects/subjects.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RegisterUserService } from '../../auth/register-user.service';
import { D } from '@angular/cdk/keycodes';
import { AuthService } from '../../auth/auth.service';
import { SessionService } from '../../auth/session.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    SubjectsComponent,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  user: any;
  public inscrito!: boolean;
  public tipo: any;
  public name: any;
  public horario!: boolean;
  public userId:  any;
  public schedule: any;
  public userTipe: any;

  private timeoutId: any;

  
  


constructor(private router: Router, private service: RegisterUserService, private auth: AuthService,
  private sessionService: SessionService
){}
  ngOnDestroy(): void {
    //this.sessionService.stopTimer();
  }


ngOnInit() {
  //this.sessionService.startSessionTimer(); // Inicia el temporizador solo si el usuario está autenticado
  ///this.sessionService.resetTimer();

  this.loadUserData();

  if (this.auth.isAuthenticated()) {

      this.userTipe = this.user.tipo;
      console.log("tipo:", this.userTipe);
      this.horario = this.user.horario;
      console.log("horario:", this.horario);
      this.inscrito = this.user.inscrito;
      console.log("inscrito:", this.inscrito);
      this.name = this.user.name;

      if (this.userTipe === 'profesor') {
          if (!this.horario) {
              Swal.fire({
                  icon: 'warning',
                  title: 'Atencion',
                  text: 'Tiene pendiente la carga de su horario laboral. ¿Desea hacerlo ahora?',
                  showCancelButton: true,
                  cancelButtonColor: 'red',
                  confirmButtonText: 'Aceptar'
              }).then((result) => {
                  if (result.isConfirmed) {
                      this.router.navigate(['/professor-subjects']);
                  }
              });
          }
      } else if (this.userTipe === 'estudiante') {
          if (!this.inscrito) {
              Swal.fire({
                  icon: 'warning',
                  title: 'Atencion',
                  text: 'Tiene pendiente tu inscripción. ¿Desea hacerlo ahora?',
                  showCancelButton: true,
                  cancelButtonColor: 'red',
                  confirmButtonText: 'Aceptar'
              }).then((result) => {
                  if (result.isConfirmed) {
                      this.router.navigate(['student-carga']);
                  }
              });
          }
      }
  }
}


startSessionTimer() {
  this.timeoutId = setTimeout(() => {
    this.showSessionExpiredAlert();
  }, 20000); // 30 segundos
}


starTimer(){
  this.loadUserData
  this.sessionService.startSessionTimer();
  

}

showSessionExpiredAlert() {
  Swal.fire({
    icon: 'warning',
    title: 'Tiempo de sesión agotado',
    text: 'Tu tiempo de sesión ha terminado. ¿Deseas continuar con 30 segundos más?',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
    confirmButtonColor: 'green',
    cancelButtonColor: 'red'
  }).then((result) => {
    if (result.isConfirmed) {
      // Reiniciar el temporizador
      this.restartSession();
    } else {
      this.logout(); // O redirigir a la página de inicio de sesión
    }
  });
}


restartSession() {
  clearTimeout(this.timeoutId);
  this.startSessionTimer(); // Reiniciar el temporizador
}

logout() {
  // Lógica para cerrar sesión
  localStorage.removeItem('user');
  localStorage.removeItem('loginTime');
  this.router.navigate(['/login']);
}



openGroups(){
  this.router.navigate(['/professor-groups']);
}


loadUserData(): void {
  const userData = localStorage.getItem('user'); // Obtén los datos del usuario de localStorage
  if (userData) {
    this.user = JSON.parse(userData); // Parsea el JSON a objeto
    console.log("user", this.user);
  } else {
    this.user = null; // Si no hay datos, asigna null o maneja según necesites
  }
}

checkDa(){
  if(this.user){
    this.tipo = this.user.tipo;
    this.inscrito = this.user.inscrito;
    this.name = this.user.name;


    this.userId = this.user._id;
    console.log("id:", this.userId);

    
/*
    this.service.getUserbyId(this.userId).subscribe({
      next: (data) => {
        console.log("Data es: ", data);
        this.schedule = data.horario;

        if(this.schedule === false){
          Swal.fire({
            icon: 'warning',
            title:'Atencion',
            text:'Tiene pendiente la carga de su horario laboral. ¿Desea hacerlo ahora?',
            showCancelButton:true,
            cancelButtonColor: 'red',
            confirmButtonText:'Aceptar'
          }).then((result) => {
            if(result.isConfirmed){
              this.router.navigate(['/professor-subjects']);
            }
          });
        }

      },
      error: (error) => {
        console.error("Error al obtener datos de usuario", error);
      }
    });

*/
    



    if(this.tipo === 'estudiante'){
      //console.log("es un estudiandte");

      if(this.inscrito === false){
        Swal.fire({
          icon:'warning',
          title:'Inscripción Pendiente',
          text:'Tienes que realizar tu proceso de inscripción.',
          showCancelButton: true,
          confirmButtonText: 'Inscribirme',
          cancelButtonText: 'Cancelar',
          cancelButtonColor: 'red'
        }).then((result) => {
          if(result.isConfirmed) {
            //console.log("se va a inscribir");
            this.choseSubjectStudent();
          }else if(result.dismiss === Swal.DismissReason.cancel){

          }
        })

      }

    }else if(this.tipo === 'profesor'){
      //console.log("es un PROFESOR");
      this.horario = this.user.horario;
      console.log("horarii:", this.horario);
      if(this.horario === false){

  
      }
    }

  }
  
}

choseSubject(){

  this.router.navigate(['/professor-subjects']);
}

choseSubjectStudent(){
  this.router.navigate(['student-carga']);
}


  showLogin(){
    console.log("al login...");
    this.router.navigate(['/login']);
  }

}
