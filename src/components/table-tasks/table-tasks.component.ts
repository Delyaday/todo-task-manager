import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import { colorSchemeDarkBlue, themeQuartz } from 'ag-grid-community';
import { Task } from '../../models/task-model';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'table-tasks-component',
  templateUrl: './table-tasks.component.html',
  styleUrl: './table-tasks.component.scss',
  standalone: true,
  imports: [AgGridAngular, AgGridModule],
})
export class TableTasksComponent {
  @Input() rowData: Task[] = [];
  @Output() rowClick = new EventEmitter<any>();

  theme = themeQuartz.withPart(colorSchemeDarkBlue);

  constructor(private _appStateService: AppStateService) {}

  columnDefs: ColDef[] = [
    {
      headerName: '№',
      valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
      sortable: true,
      filter: true,
      flex: 0.5,
    },
    {
      headerName: 'Tasks',
      field: 'title',
      sortable: true,
      filter: true,
      flex: 2,
    },
    {
      headerName: 'Description',
      field: 'description',
      sortable: true,
      filter: true,
      flex: 2,
    },
    {
      headerName: 'Status',
      field: 'completed',
      cellRenderer: (params: any) => (params.value ? '✔️' : '❌'),
      sortable: true,
      filter: true,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '',
      field: 'actions',
      cellRenderer: () => {
        return `<button class="delete-btn">🗑️</button>`;
      },
      flex: 0.5,
      cellStyle: { textAlign: 'center' },
      sortable: false,
      filter: false,
    },
  ];

  onGridReady(params: GridReadyEvent) {
    params.api.addEventListener('cellClicked', (event: any) => {
      if (
        event.colDef.field === 'actions' &&
        event.event.target.classList.contains('delete-btn')
      ) {
        event.event?.stopPropagation();
        const taskId = event.data.id;
        this._appStateService.deleteTask(taskId);
      } else {
        this.rowClick.emit(event.data);
      }
    });
  }

  onRowClicked(task: Task) {}
}
