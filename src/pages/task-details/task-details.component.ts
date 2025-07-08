import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppStateService } from '../../services/app-state.service';
import { Task } from '../../models/task-model';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    CheckboxModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
})
export class TaskDetailsComponent {
  task: Task | undefined;
  taskForm!: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _appStateService: AppStateService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._route.paramMap.subscribe((params) => {
      const taskId = params.get('id');
      this._appStateService.getTasks().subscribe((tasks) => {
        const foundTask = tasks.find((t) => t.id === taskId);
        if (foundTask) {
          this.task = foundTask;
          this.taskForm = this._fb.group({
            title: [foundTask.title, Validators.required],
            description: [foundTask.description],
            completed: [foundTask.completed],
          });
        }
      });
    });
  }

  onSubmit() {
    if (this.task && this.taskForm.valid) {
      const updatedTask: Task = {
        ...this.task,
        ...this.taskForm.value,
      };
      this._appStateService.updateTask(updatedTask);
      this._router.navigate(['/tasks']);
    }
  }

  onCancel(): void {
    this._router.navigate(['/tasks']);
  }
}
