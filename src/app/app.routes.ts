import { Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { SubjectsComponent } from './professor/subjects/subjects.component';
import { MateriasStudentComponent } from './student/materias-student/materias-student.component';
import { AuthGuard } from './auth/auth.guard';
import { GruposComponent } from './professor/grupos/grupos.component';
import { CargamateriasComponent } from './student/cargamaterias/cargamaterias.component';
import { ContactoComponent } from './info/contacto/contacto.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full' 
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'professor-subjects',
    component: SubjectsComponent,
    canActivate: [AuthGuard] // Ruta protegida
  },
  {
    path: 'professor-groups',
    component: GruposComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'student-subjects',
    component: MateriasStudentComponent,
    canActivate: [AuthGuard] // Ruta protegida
  },
  {
    path: 'student-carga',
    component: CargamateriasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contacto',
    component: ContactoComponent,
  },
  {
    path: '**', // Ruta wildcard para redirigir a login si no coincide con ninguna ruta
    redirectTo: '/login' // Redirige a la página de login
  }
];
