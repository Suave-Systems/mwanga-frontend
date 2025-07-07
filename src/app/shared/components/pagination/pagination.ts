import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  page = 0;
  pageSize = 0;
  total = 0;
  prevPage() {}
  nextPage() {}
}
