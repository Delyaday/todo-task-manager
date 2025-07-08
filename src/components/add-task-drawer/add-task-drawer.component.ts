import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppStateService } from '../../services/app-state.service';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../../models/task-model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'add-task-drawer',
  templateUrl: './add-task-drawer.component.html',
  styleUrls: ['./add-task-drawer.component.scss'],
  standalone: true,
  imports: [DrawerModule, ButtonModule, ReactiveFormsModule],
})
export class AddTaskDrawerComponent {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() addTask = new EventEmitter<{
    title: string;
    description: string;
  }>();

  taskForm: FormGroup;

  constructor(private _fb: FormBuilder, private _appStateService: AppStateService) {
    this.taskForm = this._fb.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  onSubmit() {
   if (this.taskForm.invalid) return;

  const newTask: Task = {
    id: uuidv4(),
    title: this.taskForm.value.title,
    description: this.taskForm.value.description,
    completed: false,
  };

  this._appStateService.addTask(newTask);

  this.taskForm.reset();
  this.close.emit();
  }

  closeDrawer() {
    this.close.emit();
    this.taskForm.reset();
  }
}
