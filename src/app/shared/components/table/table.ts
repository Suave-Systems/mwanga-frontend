import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenu, MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-table',
  imports: [MatMenuModule, NgClass],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  @Input() columns: { key: string; label: string }[] = [];
  @Input() data: any[] = [];
  @Input() showOptions: boolean = false;
  @Input() menuTemplate?: MatMenu;
  @Output() rowClick = new EventEmitter<any>();
  @Output() moreOptions = new EventEmitter<any>();
  @Output() menuOpened = new EventEmitter<any>();

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }
  onMoreOptions(row: any) {
    this.moreOptions.emit(row);
  }

  onMenuOpen(row: any) {
    this.menuOpened.emit(row);
  }
}
