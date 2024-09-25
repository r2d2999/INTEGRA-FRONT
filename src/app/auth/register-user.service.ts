import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  private apiUrl = 'http://localhost:3001/create'; // Asegúrate de que este URL coincide con tu backend

  private api2 = 'http://localhost:3001/login';
  private api3 = 'http://localhost:3001/update';
  private api4= 'http://localhost:3001/user';
  private api5 = 'http://localhost:3001/update/teacher';
  private api6 = 'http://localhost:3001/update/teacher';





  constructor(private http: HttpClient) { }



  getUserbyId(id: string): Observable<any> {
    return this.http.get<any>(`${this.api4}/${id}`); // Asegúrate de que estás agregando el id aquí
}

  
updateHorario(id: string, horario: boolean): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const body = { horario };

  return this.http.put<any>(`${this.api5}/${id}`, body, { headers }).pipe(
    tap(updatedUser => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      currentUser.horario = horario;
      localStorage.setItem('user', JSON.stringify(currentUser));
    })
  );
}


  //inscrito
  updateInscritoT(id: string, inscrito: boolean): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { inscrito };
  
    return this.http.put<any>(`${this.api6}/${id}`, body, { headers }).pipe(
      tap(updatedUser => {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        currentUser.inscrito = inscrito;
        localStorage.setItem('user', JSON.stringify(currentUser));
        console.log("Usuario actualizado:", currentUser); // Verifica que el usuario se actualiza
      })
    );
  }
  






  updateUserInscrito(id: string, inscrito: boolean): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { inscrito };
    return this.http.put<any>(`${this.api3}/${id}`, body, { headers });
  }



  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.api2, { email, password }, { headers });
  }
  

/*
  login(email:any, password: any): Observable<any> {
    //const nData = JSON.stringify(data);
    return this.http.post(`${this.apiUrl}/login`, email, password);
  }

  */

  //crear usuario
  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, usuario);
  }




}
