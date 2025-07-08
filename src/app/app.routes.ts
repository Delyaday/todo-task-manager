import { Routes } from '@angular/router';
import { TaskDetailsComponent } from '../pages/task-details/task-details.component';
import { TasksComponent } from '../pages/tasks/tasks.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    component: TasksComponent,
    pathMatch: 'full',
  },
  {
    path: 'tasks/:id',
    component: TaskDetailsComponent,
  },
];
