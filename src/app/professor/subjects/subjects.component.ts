import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { MateriasService } from '../materias.service';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { RegisterUserService } from '../../auth/register-user.service';
import { GroupService } from '../group.service';
import { SessionService } from '../../auth/session.service';

interface Materia {
  _id: string;
  nombre: string;
  codigo: string;
  creditos: number;
  cupos: number;
  horario: {
    dia: string;
    horaInicio: string;
    horaFin: string;
  };
  profesores: {
    profesor1: string;
    profesor2: string;
  };
  status: boolean;
}

interface User {
  id: number;
  name: string;
  _id: any;
}

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    MatSelectModule
  ],
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {
  public materias: Materia[] = [];
  public materiasSeleccionadas: Materia[] = [];
  public materiasDisponibles: Materia[] = [];
  public selectedMateriaId: string = '';
  public selectedMateriaIdToRemove: string = '';
  public user: User | null = null;

  public userName: any;
  public userId: any;

  constructor(private service: MateriasService, private router: Router, private userService: RegisterUserService,
              private groupService: GroupService, private sService: SessionService) {}

  ngOnInit(): void {
    //this.sService.resetTimer();

    this.loadUser();
    this.loadMaterias();
  }

  loadUser() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = this.user?.name;
    if (this.user) {
      this.userId = this.user._id;
    }
  }

  loadMaterias() {
    this.service.getMaterias().subscribe({
      next: (data) => {
        const nuevoProfesor = this.user?.name || 'no'; // Obtener el nombre del usuario actual
  
        // Filtrar materias que no tienen a este profesor y que tienen espacio para más profesores
        const data_filtered = data.filter((materia: any) =>
          (materia.profesores.profesor1 === "no" || materia.profesores.profesor2 === "no") &&
          (materia.profesores.profesor1 !== nuevoProfesor && materia.profesores.profesor2 !== nuevoProfesor)
        );
  
        this.materias = data_filtered.map((materia: any) => ({ ...materia, status: true }));
        this.updateDisponibles();
      },
      error: (error) => {
        console.error("Error al cargar las materias", error);
      }
    });
  }
  
  async updateAllInfo() {
    try {
      await this.updateProfessor();
      await this.finalizar();
      await this.finalize();
    } catch (error) {
      console.error('Error durante la actualización:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al realizar la actualización. Intenta nuevamente.'
      });
    }
  }
  
  


  //actualiza el valor de profesor en las mateiras
  updateProfessor(): Promise<void> {
    return new Promise((resolve, reject) => {
      const nuevoProfesor = this.user?.name || 'no'; 
      const materiaIds = this.materiasSeleccionadas.map(m => m._id); 
  
      console.log('Nuevo profesor:', nuevoProfesor);
      console.log('IDs de materias:', materiaIds);
  
      if (materiaIds.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Selecciona una o más materias',
          text: 'Por favor, selecciona al menos una materia para actualizar el profesor.'
        });
        return resolve(); // Resolvemos para evitar que la promesa se quede pendiente
      }
  
      const updatePromises = materiaIds.map(materiaId => {
        const materia = this.materias.find(m => m._id === materiaId);
        if (materia) {
          if (materia.profesores.profesor1 === 'no') {
            materia.profesores.profesor1 = nuevoProfesor;
          } else if (materia.profesores.profesor2 === 'no') {
            materia.profesores.profesor2 = nuevoProfesor;
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `La materia ${materia.nombre} ya tiene dos profesores asignados.`
            });
            return Promise.resolve(null);
          }
  
          return this.service.updateProfesor(materiaId, nuevoProfesor).toPromise();
        }
        return Promise.resolve(null);
      });
  
      Promise.all(updatePromises)
        .then(responses => {
          const successfulUpdates = responses.filter(response => response !== null);
          if (successfulUpdates.length > 0) {
            Swal.fire({
              icon: 'success',
              title: 'Profesores actualizados',
              text: `Se han asignado profesores a las materias seleccionadas.`
            });
            this.loadMaterias();
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Sin cambios',
              text: 'No se realizaron actualizaciones. Asegúrate de que las materias tengan espacio para nuevos profesores.'
            });
          }
          resolve(); // Resolvemos la promesa
        })
        .catch(error => {
          console.error('Error al actualizar los profesores:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron actualizar los profesores. Intenta nuevamente.'
          });
          reject(error); // Rechazamos la promesa en caso de error
        });
    });
  }
  
  

  horariosSeEmpalman(nuevaMateria: Materia): boolean {
    return this.materiasSeleccionadas.some(materia => {
      return (
        materia.horario.dia === nuevaMateria.horario.dia &&
        (
          (nuevaMateria.horario.horaInicio >= materia.horario.horaInicio && nuevaMateria.horario.horaInicio < materia.horario.horaFin) ||
          (nuevaMateria.horario.horaFin > materia.horario.horaInicio && nuevaMateria.horario.horaFin <= materia.horario.horaFin) ||
          (nuevaMateria.horario.horaInicio <= materia.horario.horaInicio && nuevaMateria.horario.horaFin >= materia.horario.horaFin)
        )
      );
    });
  }

  //Sube los grupos
  finalizar(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.materiasSeleccionadas.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'No hay materias seleccionadas',
          text: 'Por favor, selecciona al menos una materia para finalizar.'
        });
        return resolve();
      }
  
      const groupPromises = this.materiasSeleccionadas.map(materia => {
        const newGroup = {
          name: `${materia.nombre}-A`,
          profesor: this.userId,
          cupo: 3,
          materia: materia.nombre,
          horario: {
            dia: materia.horario.dia,
            horaInicio: materia.horario.horaInicio,
            horaFin: materia.horario.horaFin
          }
        };
  
        return this.groupService.createGroup(newGroup).toPromise();
      });
  
      Promise.all(groupPromises)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Grupos creados',
            text: 'Los grupos se han creado exitosamente.'
          });
          resolve();
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron crear los grupos. Intenta nuevamente.'
          });
          reject(error);
        });
    });
  }
  

  addSubject(id: string) {
    const materia = this.materias.find(m => m._id === id && m.status);
    if (materia && !this.materiasSeleccionadas.some(m => m._id === id)) {
      const nuevaMateria: Materia = { ...materia };

      if (nuevaMateria.profesores.profesor1 === 'no') {
        nuevaMateria.profesores.profesor1 = this.user?.name || 'no';
      } else if (nuevaMateria.profesores.profesor2 === 'no') {
        nuevaMateria.profesores.profesor2 = this.user?.name || 'no';
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se puede agregar más de 2 profesores por materia.'
        });
        return;
      }

      if (this.horariosSeEmpalman(nuevaMateria)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se puede agregar esa materia porque se empalma con otra materia.'
        });
        return;
      }

      this.materiasSeleccionadas.push(nuevaMateria);
      this.updateStatus(id, false); // Cambiar el status a false
    }
  }

  removeSubject(id: string) {
    const materia = this.materiasSeleccionadas.find(m => m._id === id);
    if (materia) {
      this.materiasSeleccionadas = this.materiasSeleccionadas.filter(m => m._id !== id);
      const originalMateria = this.materias.find(m => m._id === id);
      if (originalMateria) {
        if (materia.profesores.profesor1 === this.userName) {
          originalMateria.profesores.profesor1 = 'no';
        }
        if (materia.profesores.profesor2 === this.userName) {
          originalMateria.profesores.profesor2 = 'no';
        }
      }

      this.updateStatus(id, true); // Cambiar el status a true
    }
  }

  updateStatus(id: string, status: boolean) {
    const materia = this.materias.find(m => m._id === id);
    if (materia) {
      materia.status = status;
      this.updateDisponibles(); // Actualizar materias disponibles
    }
  }

  updateDisponibles() {
    this.materiasDisponibles = this.materias.filter(m => m.status);
  }

  updateSchedule() {
    this.userService.updateHorario(this.userId, true).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Carga Finalizada',
          text: 'Carga finalizada con éxito'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/home']);
          }
        });
      },
      error: (error) => {
        console.error("Error al actualizar el usuario", error);
      }
    });
  }


  //Sube horario
  finalize(): Promise<void> {
    console.log("Materias seleccionadas:", this.materiasSeleccionadas);
  
    return new Promise((resolve) => {
      Swal.fire({
        icon: 'warning',
        title: 'Finalizar Carga',
        text: '¿Está seguro de querer terminar su carga de horario laboral?',
        showCancelButton: true,
        cancelButtonColor: 'red',
        confirmButtonText: 'Terminar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateSchedule(); // Esta función también debería devolver una promesa
          resolve();
        } else {
          resolve(); // Resolvemos si no se confirma
        }
      });
    });
  }
  


}
