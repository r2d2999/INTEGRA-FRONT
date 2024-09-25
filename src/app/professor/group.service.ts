import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GroupService {
  
  public apiUrl: string = 'http://localhost:3001/grupo/crear';
  public apuUrl2: string = 'http://localhost:3001/grupos';
  public apuUrl3: string = 'http://localhost:3001/grupos/';

  constructor(private http: HttpClient) { }

  //return this.http.get(`${this.api2}/${id}`);


  //GET GROUP BY ID
  getGroupById(id: any): Observable<any>{
    return this.http.get<any>(`${this.apuUrl3}${id}`);
  }

  //GET ALL GRUPOS
  getGroups(): Observable<any>{
    return this.http.get<any>(this.apuUrl2);
  }


  //CREA GRUPOS 
  createGroup(groupData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, groupData, { headers });
  }
}
