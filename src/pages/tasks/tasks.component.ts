import { Component } from '@angular/core';
import { Task } from '../../models/task-model';
import { SearchComponent } from '../../components/search/search.component';
import { Observable, Subject, takeUntil, pipe } from 'rxjs';
import { AppStateService } from '../../services/app-state.service';
import { TableTasksComponent } from '../../components/table-tasks/table-tasks.component';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ButtonModule } from 'primeng/button';
import { AddTaskDrawerComponent } from '../../components/add-task-drawer/add-task-drawer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'tasks-page',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: true,
  imports: [
    SearchComponent,
    TableTasksComponent,
    AddTaskDrawerComponent,
    AgGridAngular,
    AgGridModule,
    ButtonModule,
  ],
})
export class TasksComponent {
  tasks: Task[] = [];
  searchQuery: string = '';
  searchResults: Task[] = [];
  selectedTask: Observable<Task> | null = null;
  isLoading: boolean = false;
  error: string = '';
  isAddTaskModalOpen: boolean = false;

  private _destroy = new Subject<void>();

  constructor(
    private _router: Router,
    private _appStateService: AppStateService
  ) {}

  ngOnInit() {
    // this._appStateService.initializeTasks();

    this._appStateService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });

    this._appStateService.getSearchResults().subscribe((results) => {
      this.searchResults = results ?? [];
    });
  }

  toggleTaskCompletion(task: any) {
    task.completed = !task.completed;
  }

  search(query: string) {
    this.searchQuery = query;
    this.error = '';

    if (!query.trim()) {
      this._appStateService.updateSearchResults([]);
      return;
    }

    const filtered = this.tasks.filter((task) =>
      task.title.toLowerCase().includes(query.toLowerCase())
    );

    this._appStateService.updateSearchResults(filtered);

    if (filtered.length === 0) {
      this.error = 'No tasks found';
    }
  }

  onOpenAddTaskModal() {
    this.isAddTaskModalOpen = true;
  }

  onCloseAddTaskModal() {
    this.isAddTaskModalOpen = false;
  }

  onRowClick(task: Task) {
     console.log('Selected task:', task);
    this._router.navigate(['/tasks', task?.id]);
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }
}
