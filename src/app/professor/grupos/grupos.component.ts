import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { GroupService } from '../group.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from '../../auth/session.service';

export interface Grupo {
  horario: {
    dia: string;
    horaInicio: string;
    horaFin: string;
  };
  _id: string;
  name: string;
  profesor: string;
  cupo: number;
  materia: string;
}



@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule
  ],
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.scss'
})
export class GruposComponent implements OnInit, OnDestroy {
  public list_groups: Grupo[] = []; 

  public userId: any;
  public user: any;

  constructor(private gService: GroupService, private router: Router,
      private sService: SessionService
  ) {}

  ngOnDestroy(): void {
    //this.sService.stopTimer();
  }

  ngOnInit(): void {
    //this.sService.resetTimer();
    this.loadUserData();
    this.loadGroupData();
  }

  loadUserData(){
    const userData = localStorage.getItem('user'); 
    if (userData) {
      this.user = JSON.parse(userData); 
      //console.log("user", this.user);

      this.userId = this.user._id;
      //console.log("id", this.userId);



    } else {
      this.user = null; 
    }


  }

  loadGroupData() {

    this.gService.getGroupById(this.userId).subscribe(
      {
        next:(data)=> {
          this.list_groups = data;
          console.log("lista:", this.list_groups);
        },
        error:(error) => {
          console.error("error al cargar los grupos", error);

        }
      }
    )


    /*
    this.gService.getGroups().subscribe({
      next: (data: Grupo[]) => {
        this.list_groups = data;
        console.log("lista:", this.list_groups);
      },
      error: (error) => {
        console.error("error al cargar los grupos");
      }
    });

    */
  }


  goToSubjects(){
    this.router.navigate(['/professor-subjects']);

  }


  getBack(){
    this.router.navigate(['/home']);
  }


}
