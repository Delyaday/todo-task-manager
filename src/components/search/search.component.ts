import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'search-component',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  standalone: true,
  imports: [],
})
export class SearchComponent {
  @Input() query: string = '';
  @Output() searchQueryChange = new EventEmitter<string>();

  private _searchSubject: Subject<string> = new Subject<string>();
  private _destroy = new Subject<void>();

  constructor(private _appStateService: AppStateService) {}

  ngOnInit(): void {
    this._searchSubject
      .pipe(debounceTime(300), takeUntil(this._destroy))
      .subscribe((value) => {
        this.query = value;
        this.searchQueryChange.emit(value); 
        this._appStateService.updateSearchQuery(value);
      });
  }

  onInputChange(value: string) {
    this.query = value;
    this._searchSubject.next(value);
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }
}
