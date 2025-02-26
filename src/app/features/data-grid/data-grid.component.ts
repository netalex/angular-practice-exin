
import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { Column } from './models/column';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridConfig } from './models/grid-config';

// Definizione del config di default
const defaultConfig: GridConfig = {
  pageSize: 10,
  pageSizeOptions: [5, 10, 25, 50],
  showPagination: true,
  showSearch: true,
  showFilters: true,
  showPriceRange: true
};

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    NzPaginationModule,
    NzTableModule
  ],
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataGridComponent<T> implements OnInit {
  @Input() columns: Column[] = [];
  @Input() data: T[] = [];
  @Input() useNzPagination = false;
  @Input() config: GridConfig = defaultConfig;

  dataSource = new MatTableDataSource<T>();
  displayedColumns: string[] = [];
  searchValue = '';

  // Altre proprietà per gestire paginazione, ordinamento, ecc.

  ngOnInit() {
    this.dataSource.data = this.data;
    this.displayedColumns = this.columns.map(column => column.key);

    // Setup per filtri, ordinamento, ecc.
  }

  // Implementare metodi per ricerca, ordinamento, filtro, paginazione
}
