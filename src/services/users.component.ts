import { Component, OnDestroy, OnInit } from '@angular/core';
import { User, UsersLoadService } from './users-load.service';
import {
  debounceTime,
  distinctUntilChanged,
  pipe,
  Subject,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'users-page',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  standalone: true,
  imports: [],
})
export class Users implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];

  private _searchSubject: Subject<string> = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private _usersService: UsersLoadService) {}

  ngOnInit() {
    this._usersService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => (this.users = users));

    this._searchSubject
      .pipe(debounceTime(300), takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((value) => {
        this.filterUsers(value);
      });
  }

  onSearchInput(value: string) {
    this._searchSubject.next(value);
  }

  filterUsers(searchString: string) {
    this.filteredUsers = this.users.filter((user) =>
      user.name.toLowerCase().includes(searchString.toLowerCase())
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
