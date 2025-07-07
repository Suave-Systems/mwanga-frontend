import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../button/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-table-filters',
  imports: [
    FormsModule,
    Button,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  templateUrl: './table-filters.html',
  styleUrl: './table-filters.scss',
})
export class TableFilters {
  search = '';
  from_date = '';
  to_date = '';
  selectedCategory = '';
  selectedFilter = '';
  @Input('showCategoryFilter') showCategoryFilter = false;
  @Input('showSearch') showSearch = false;
  @Input('showDownload') showDownload = false;

  @Input('showFilter') showFilter = false;
  @Input('filterArray') filterArray: any[] = [];
  @Input('filterLabel') filterLabel = 'Filter By';
  @Input('filterDisplayName') filterDisplayName = 'name';
  @Input('filterValue') filterValue = 'value';

  @Output('applyFilters') applyFilters = new EventEmitter<{
    search: string;
    from_date: any;
    to_date: any;
    filter: any;
  }>();

  onApplyFilter() {
    this.applyFilters.emit({
      search: this.search,
      from_date: this.from_date,
      to_date: this.to_date,
      filter: this.selectedFilter,
    });
  }

  onClearFilter() {
    this.search = '';
    this.from_date = '';
    this.to_date = '';
    this.selectedFilter = '';
    this.onApplyFilter();
  }

  onDownloadCSV() {}
}
