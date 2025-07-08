import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Task } from '../models/task-model';
import { AppState } from '../models/app-state.model';
import { v4 as uuidv4 } from 'uuid';
import { TasksStorageService } from './tasks-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private _state: AppState = {
    tasks: [],
    searchQuery: '',
    searchResults: [],
    isLoading: false,
    error: null,
  };

  private _stateSubject = new BehaviorSubject<AppState>(this._state);
  public readonly state$ = this._stateSubject.asObservable();

  constructor(private _tasksStorageService: TasksStorageService) {}

  getState(): Observable<AppState> {
    return this.state$;
  }

  private async setState(newState: Partial<AppState>) {
    this._state = { ...this._state, ...newState };
    this._stateSubject.next(this._state);

    await this._tasksStorageService.saveTasks(this._state.tasks);
  }

  getTasks(): Observable<Task[]> {
    return this.state$.pipe(map((state) => state.tasks));
  }

  async initializeTasks() {
    const initialTasks: Task[] = await this._tasksStorageService.loadTasks();

    this.setState({ tasks: initialTasks, searchResults: initialTasks });
  }

  addTask(task: Task) {
    this.setState({ tasks: [...this._state.tasks, task] });
  }

  deleteTask(taskId: string) {
    const tasks = this._state.tasks.filter((task) => task.id !== taskId);
    this.setState({ tasks });
  }

  updateTask(updatedTask: Task) {
    const tasks = this._state.tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.setState({ tasks });
  }

  updateSearchQuery(query: string): void {
    this.setState({ searchQuery: query });
  }

  updateSearchResults(results: Task[]): void {
    this.setState({ searchResults: results });
  }

  clearTasks() {
    this.setState({ tasks: [] });
  }

  searchTasks(query: string) {
    const filtered = this._state.tasks.filter((task) =>
      task.title.toLowerCase().includes(query.toLowerCase())
    );

    this.setState({
      searchQuery: query,
      searchResults: filtered,
    });
  }

  getSearchResults(): Observable<Task[] | undefined> {
    return this.state$.pipe(map((state) => state.searchResults));
  }

  getLoading(): Observable<boolean> {
    return this.state$.pipe(map((state) => state.isLoading ?? false));
  }

  getError(): Observable<string | null> {
    return this.state$.pipe(map((state) => state.error ?? null));
  }

  setLoading(value: boolean) {
    this.setState({ isLoading: value });
  }

  setError(message: string | null) {
    this.setState({ error: message });
  }
}
