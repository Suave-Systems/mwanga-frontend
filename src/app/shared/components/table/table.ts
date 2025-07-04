import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  @Input() columns: { key: string; label: string }[] = [];
  @Input() data: any[] = [];
  @Output() rowClick = new EventEmitter<any>();

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }
}
