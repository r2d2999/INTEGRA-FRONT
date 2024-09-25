import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  private apiUrl = 'http://127.0.0.1:3001/materias'; 
  private apiUrl2 = 'http://127.0.0.1:3001/add/materias'; 

  private api2 = 'http://localhost:3001/profesores/';

  constructor(private http: HttpClient) {}

  // Método para obtener todas las materias
  getMaterias(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getProfesores(): Observable<any> {
    return this.http.get<any>(this.api2);
  }


  getProfesorById(id: string): Observable<any> {
    return this.http.get(`${this.api2}/${id}`);
  }

// Método para actualizar el profesor de una materia esta
updateProfesor(materiaId: string, nuevoProfesor: string): Observable<any> {
  const url = `${this.apiUrl2}/${materiaId}`;
  return this.http.put(url, { profesores: nuevoProfesor }); 
}


// Método en el servicio
updateUserMaterias(userId: string, materiaCodigo: string): Observable<any> {
  const url = `${this.apiUrl}/users/${userId}/materias`;
  return this.http.put(url, { codigo: materiaCodigo });
}



}
