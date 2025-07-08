import { Injectable } from '@angular/core';
import { Task } from '../models/task-model';

const TASKS_STORAGE_KEY = 'tasks_storage_key';

@Injectable({
  providedIn: 'any',
})
export class TasksStorageService {
  loadTasks(): Promise<Task[]> {
    const tasksJson = localStorage.getItem(TASKS_STORAGE_KEY);

    if (tasksJson) {
      const tasks: Task[] = JSON.parse(tasksJson);

      return Promise.resolve(tasks);
    }

    return Promise.resolve([]);
  }

  saveTasks(tasks: Task[]): Promise<void> {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));

    return Promise.resolve();
  }
}
