import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {
  public urlApi: string = 'http://localhost:3001/horarios';
  public urlApi2: string = 'http://localhost:3001/horario/crear';


  constructor(private http: HttpClient) { }

  //get all horarios
  getAllHorarios(): Observable<any>{
    return this.http.get<any>(this.urlApi);
  }


  //create
  createHorario(horarioData: any):Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.post<any>(this.urlApi2, horarioData, { headers});
  }

}
