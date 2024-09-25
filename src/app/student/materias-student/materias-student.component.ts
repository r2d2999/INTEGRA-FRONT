import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { MateriasService } from '../../professor/materias.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RegisterUserService } from '../../auth/register-user.service';


interface Materia {
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
}

interface User {
  id: number;
  name: string;
  email: string;
  subjects: { [key: string]: Materia[] };
}


@Component({
  selector: 'app-materias-student',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
  ],
  templateUrl: './materias-student.component.html',
  styleUrls: ['./materias-student.component.scss'] // Corregido 'styleUrl' a 'styleUrls'
})
export class MateriasStudentComponent implements OnInit {
  public materias: any[] = [];
  materiasSinProfesor: any[] = [];

  selectedMateriaId: string | null = null; 
  selectedMateriaCode: string | null = null;

  teacherId: any;
  user: any;
  teachersMap: any;

  isReady: boolean = false;

  public userId: any;


 
  materiasSeleccionadas: Materia[] = [];

  constructor(private service: MateriasService, private router: Router, private userService: RegisterUserService ) {}

  ngOnInit(): void {
    
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Usuario data:', this.user);
    this.userId = this.user._id;

    console.log("id: ", this.userId);

    this.showMaterias();
    this.showTeachersData();
  }


  updateStudent(){
   

    //realizar updtate a inscrito:
    this.userService.updateUserInscrito(this.userId, true).subscribe({
      next: (data) => {
        console.log('Actualización exitosa', data);
      },
      error: (error) => {
        console.error('Error en la actualización', error.message || error);
      }
    });


    localStorage.removeItem('user');
    //borrar local storage
    console.log("se borro el storage");


    //login otra vez
    this.userService.login("arm@mail.com", "123").subscribe({
      next: (data) => {
        console.log("login otra vez", data);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log("user Storage updated:", data.user);

      },
      error: (error) => {
        console.error("error", error.message || error);
      }
    });
    
  

  }


  quitarMateria(materia: Materia) {
    const index = this.materiasSeleccionadas.findIndex(m => m.codigo === materia.codigo);
    if (index !== -1) {
      this.materiasSeleccionadas.splice(index, 1);
      console.log(`La materia ${materia.nombre} ha sido eliminada.`);
    } else {
      console.log(`La materia ${materia.nombre} no está en la lista.`);
    }
  }

  printHorario() {
    const headers = ['Nombre', 'Código', 'Créditos', 'Cupos', 'Día', 'Hora Inicio', 'Hora Fin', 'Profesor'];
    const rows = this.materiasSeleccionadas.map(materia => [
      materia.nombre,
      materia.codigo,
      materia.creditos,
      materia.cupos,
      materia.horario.dia,
      materia.horario.horaInicio,
      materia.horario.horaFin,
      `${this.teachersMap[materia.profesores.profesor1] || 'No asignado'}, ${this.teachersMap[materia.profesores.profesor2] || 'No asignado'}`
    ]);

    let txtContent = headers.join('\t') + '\n';
    rows.forEach(row => {
      txtContent += row.join('\t') + '\n';
    });

   

    Swal.fire({
      icon: 'warning',
      title: 'Finalizar Proceso',
      text: 'Al presionar Aceptar NO podras hacer cambios en tu horario. También se generara un archivo con tu horario.',
      showCancelButton: true,
      cancelButtonColor: 'red',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green'
    }).then((result) => {
      if(result.isConfirmed){
        console.log("Proceso Finalizado");

        /*
        const blob = new Blob([txtContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'horario.txt';
        a.click();
        window.URL.revokeObjectURL(url);
    
        console.log("El horario se ha generado y descargado como archivo .txt");
        */
        
        this.updateStudent();
        this.router.navigate(['']);
      }
    })

/*
    // Mostrar confirm y redirigir al home
    if (confirm('El proceso de inscripción ha finalizado. Presiona "Aceptar" para regresar al inicio.')) {
      this.router.navigate(['/home']);
    }

    */

  }

 

  endSubject() {
    const numMaterias = this.materiasSeleccionadas.length;
    if (numMaterias >= 3 && numMaterias <= 7) {
      console.log('El número de materias es válido.');

      Swal.fire({
        icon: 'warning',
        title: 'Terminar Selección',
        text: '¿Has terminado de seleccionar tus materias?',
        showCancelButton: true,
        cancelButtonColor: 'red',
        confirmButtonText: 'Aceptar',
      }).then((result) => {
        if(result.isConfirmed){
          this.isReady = true;

        }else if(result.dismiss === Swal.DismissReason.cancel){
          this.isReady = false;

        }
      })

    } else {
      console.log('El número de materias no es válido. Debe haber entre 3 y 7 materias.');
      this.isReady = false;

    }
  }
  
  anadirMateria(materia: Materia) {
    const existe = this.materiasSeleccionadas.some(m => m.codigo === materia.codigo);
    if (existe) {
      console.log(`La materia ${materia.nombre} ya ha sido agregada.`);
      return;
    }

    const solapamiento = this.materiasSeleccionadas.some(m => 
      m.horario.dia === materia.horario.dia &&
      ((m.horario.horaInicio <= materia.horario.horaInicio && materia.horario.horaInicio < m.horario.horaFin) ||
       (m.horario.horaInicio < materia.horario.horaFin && materia.horario.horaFin <= m.horario.horaFin))
    );

    if (solapamiento) {
      alert(`La materia ${materia.nombre} tiene un horario que se solapa con otra materia seleccionada.`);
      return;
    }

    this.materiasSeleccionadas.push(materia);
    console.log(this.materiasSeleccionadas);
  }

 


  showTeachersData() {
    this.service.getProfesores().subscribe({
        next: (data) => {
            console.log(data);
            // Crear un mapa de ID a nombre
            this.teachersMap = data.reduce((map: { [x: string]: any; }, teacher: { _id: string | number; name: any; }) => {
                map[teacher._id] = teacher.name;
                return map;
            }, {});
            console.log('Mapa de profesores:', this.teachersMap);
        }
    });
}


  

showMaterias() {
  this.service.getMaterias().subscribe({
      next: (data) => {
          console.log(data);
          this.materias = data;

          // Filtrar materias sin profesor
          this.materiasSinProfesor = this.materias.filter(materia => 
              materia.profesores.profesor1 === 'no' || materia.profesores.profesor2 === 'no'
          );

          // Mostrar valores de profesor1 y profesor2 en consola
          this.materias.forEach(materia => {
              console.log(`Materia: ${materia.nombre}`);
              console.log(`Profesor 1: ${this.teachersMap[materia.profesores.profesor1] || 'No asignado'}`);
              console.log(`Profesor 2: ${this.teachersMap[materia.profesores.profesor2] || 'No asignado'}`);
          });
      },
      error: (error) => {
          console.error('Error al cargar las materias', error);
      }
  });
}

}
