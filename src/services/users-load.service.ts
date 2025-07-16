import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Observable, tap, throwError } from "rxjs";

export interface User {
    id: number;
    name: string;
    phone: string;
}

@Injectable ({
    providedIn: 'root'
})
export class UsersLoadService {
    
    private _apiUrl = 'localhost:3000/users';

    private usersSubject = new BehaviorSubject<User[]>([]);
    private readonly state$ = this.usersSubject.asObservable();

    constructor(private httpClient: HttpClient) {}

    getUsers(): Observable<User[]> {
        return this.httpClient.get<User[]>(this._apiUrl).pipe(
            tap((users) => {
                this.usersSubject.next(users);
            }),
            catchError((error) => {
                console.error(error);
                return throwError(() => new Error('Warning'))
            })
        )
    }


}