import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //private userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user') || '{}'));
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user') || '{"inscrito": false}'));

  user$ = this.userSubject.asObservable();

  updateUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }
}
