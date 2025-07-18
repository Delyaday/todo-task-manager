import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TasksComponent } from '../pages/tasks/tasks.component';
import { AppStateService } from '../services/app-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TasksComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ToDoListAngular';

  constructor(private _appStateService: AppStateService) {
    this._appStateService.initializeTasks();
  }
}
