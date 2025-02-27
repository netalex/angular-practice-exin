import { Component, ChangeDetectionStrategy, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
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
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    NzPaginationModule,
    NzTableModule
  ],
  template: `
    <!-- Header con ricerca e filtri -->
    <div class="datagrid-header" *ngIf="config.showSearch || config.showFilters || config.showPriceRange">
      <input *ngIf="config.showSearch"
             [(ngModel)]="searchValue"
             (input)="onSearchChange()"
             class="search-input"
             type="text"
             placeholder="Search...">

      <select *ngIf="config.showFilters"
              class="filter-select"
              [(ngModel)]="selectedCategory"
              (change)="onCategoryChange()">
        <option value="">All categories</option>
        <option *ngFor="let cat of categories" [value]="cat">{{cat}}</option>
      </select>

      <div *ngIf="config.showPriceRange" class="price-range">
        <input type="number" [(ngModel)]="minPrice" placeholder="Min" (change)="onPriceChange()">
        <input type="number" [(ngModel)]="maxPrice" placeholder="Max" (change)="onPriceChange()">
      </div>
    </div>

    <!-- Table con ordinamento -->
    <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
      <ng-container *ngFor="let column of columns" [matColumnDef]="column.key">
        <th mat-header-cell *matHeaderCellDef>
          {{column.label}}
          <button *ngIf="column.sortable"
                  class="sort-button"
                  (click)="sortData(column.key)">
            ↕
          </button>
        </th>
        <td mat-cell *matCellDef="let row">
          <ng-container *ngIf="column.cellTemplate; else defaultCell">
            <ng-container *ngTemplateOutlet="column.cellTemplate; context: {$implicit: row, column: column}">
            </ng-container>
          </ng-container>
          <ng-template #defaultCell>
            {{row[column.key]}}
          </ng-template>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <!-- Footer con paginazione -->
    <div class="datagrid-footer" *ngIf="config.showPagination">
      <div *ngIf="!useNzPagination">
        <mat-paginator [pageSize]="config.pageSize || 10"
                      [pageSizeOptions]="config.pageSizeOptions || [5, 10, 25, 50]">
        </mat-paginator>
      </div>
      <div *ngIf="useNzPagination">
        <nz-pagination [nzPageIndex]="1"
                      [nzTotal]="originalData.length"
                      [nzPageSize]="config.pageSize || 10">
        </nz-pagination>
      </div>
    </div>
  `,
  styles: [`
    .datagrid-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
    }

    .search-input {
      padding: 8px 12px;
      width: 200px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-right: 10px;
    }

    .filter-select {
      margin: 0 8px;
      width: 150px;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .price-range {
      display: flex;
      align-items: center;
    }

    .price-range input {
      width: 80px;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin: 0 4px;
    }

    table {
      width: 100%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }

    .sort-button {
      background: none;
      border: none;
      cursor: pointer;
      color: #666;
      margin-left: 8px;
    }

    .sort-button:hover {
      color: #333;
    }

    .datagrid-footer {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .datagrid-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .search-input, .filter-select, .price-range {
        width: 100%;
        margin: 5px 0;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataGridComponent<T> implements OnInit, AfterViewInit {
  @Input() columns: Column[] = [];
  @Input() data: T[] = [];
  @Input() config: GridConfig = defaultConfig;
  @Input() useNzPagination = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Manteniamo una copia dei dati originali
  originalData: T[] = [];
  filteredData: T[] = [];

  dataSource = new MatTableDataSource<T>();
  displayedColumns: string[] = [];

  // Filtri separati
  searchValue = '';
  selectedCategory = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  categories: string[] = [];

  // Ordinamento
  sortDirection: 'asc' | 'desc' | '' = '';
  sortedColumn = '';

  ngOnInit() {
    // Salva una copia dei dati originali
    this.originalData = [...this.data];
    this.filteredData = [...this.data];

    // Imposta i dati sul dataSource
    this.dataSource.data = this.filteredData;
    this.displayedColumns = this.columns.map(column => column.key);

    // Estrai le categorie uniche per il dropdown
    if (this.config.showFilters) {
      this.extractCategories();
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  // Estrai categorie uniche dai dati
  private extractCategories() {
    const categoryColumn = this.columns.find(col => col.filterable)?.key ?? '';
    if (categoryColumn && this.originalData.length > 0) {
      const categories = new Set<string>();
      this.originalData.forEach(item => {
        // Tipizziamo l'item come un oggetto con proprietà indicizzabili di tipo string
        const typedItem = item as Record<string, unknown>;
        const value = typedItem[categoryColumn] as string;
        if (value) categories.add(value);
      });
      this.categories = Array.from(categories);
    }
  }

  // Applica tutti i filtri ai dati originali
  applyFilters(): void {
    this.filteredData = this.originalData.filter(item => {
      // Tipizziamo l'item come un oggetto con proprietà indicizzabili di tipo string
      const typedItem = item as Record<string, unknown>;

      // Filtro testuale
      const matchesSearch = !this.searchValue ||
        this.displayedColumns.some(col => {
          const value = typedItem[col];
          return String(value).toLowerCase().includes(this.searchValue.toLowerCase());
        });

      // Filtro per categoria
      const categoryColumn = this.columns.find(col => col.filterable)?.key ?? '';
      const category = typedItem[categoryColumn] as string;
      const matchesCategory = !this.selectedCategory ||
        category === this.selectedCategory;

      // Filtro per prezzo
      const priceColumn = 'price'; // Possiamo anche trovarlo dinamicamente cercando una colonna specifica
      const price = typedItem[priceColumn] as number;
      const matchesPrice = (!this.minPrice || price >= this.minPrice) &&
        (!this.maxPrice || price <= this.maxPrice);

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Aggiorna il dataSource con i dati filtrati
    this.dataSource.data = this.filteredData;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Gestisce il cambiamento del filtro di ricerca
  onSearchChange(): void {
    this.applyFilters();
  }

  // Gestisce il cambiamento del filtro di categoria
  onCategoryChange(): void {
    this.applyFilters();
  }

  // Gestisce il cambiamento del filtro di prezzo
  onPriceChange(): void {
    this.applyFilters();
  }

  // Ordinamento manuale
  sortData(column: string) {
    if (this.sortedColumn === column) {
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else if (this.sortDirection === 'desc') {
        this.sortDirection = '';
      } else {
        this.sortDirection = 'asc';
      }
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'asc';
    }

    if (this.sortDirection === '') {
      this.sortedColumn = '';
      // Ripristina l'ordine originale ma mantiene i filtri
      this.dataSource.data = [...this.filteredData];
    } else {
      // Ordina i dati filtrati
      this.dataSource.data = [...this.filteredData].sort((a, b) => {
        const typedA = a as Record<string, unknown>;
        const typedB = b as Record<string, unknown>;
        const valueA = typedA[column];
        const valueB = typedB[column];

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return this.sortDirection === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        } else if (typeof valueA === 'number' && typeof valueB === 'number') {
          return this.sortDirection === 'asc'
            ? valueA - valueB
            : valueB - valueA;
        } else {
          // Fallback per altri tipi di valori
          const strA = String(valueA);
          const strB = String(valueB);
          return this.sortDirection === 'asc'
            ? strA.localeCompare(strB)
            : strB.localeCompare(strA);
        }
      });
    }
  }

  // Icona per ordinamento
  getSortIcon(column: string): string {
    if (this.sortedColumn !== column) return 'unfold_more';
    return this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }
}
