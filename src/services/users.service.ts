import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _apiUrl = 'localhost:3000/users';

  private usersSubject = new BehaviorSubject<User[]>(this._loadFromLocalStorage());
  public readonly users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this._apiUrl).pipe(
      tap((users) => {
        this.usersSubject.next(users);
        this._saveToLocalStorage(users);
      }),
      catchError((error) => {
        console.error('Ошибка при получении пользователей:', error);
        return throwError(() => new Error('Не удалось загрузить пользователей.'));
      })
    );
  }

  private _loadFromLocalStorage(): User[] {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : [];
  }

   private _saveToLocalStorage(users: User[]) {
    localStorage.setItem('users', JSON.stringify(users));
  }
}
