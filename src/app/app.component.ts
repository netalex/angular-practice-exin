import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataGridComponent } from './features/data-grid/data-grid.component';
import { Column } from './features/data-grid/models/column';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DataGridComponent],
  templateUrl: './app.component.html',
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .high-price {
      color: #d32f2f;
      font-weight: bold;
    }

    .low-price {
      color: #388e3c;
      font-weight: bold;
    }
  `]
})
export class AppComponent {
  @ViewChild('priceTemplate') priceTemplate!: TemplateRef<any>;

  title = 'angular-practice-exin';

  gridConfig = {
    pageSize: 5,
    showPagination: true,
    showSearch: true,
    showFilters: true,
    showPriceRange: true
  };

  columns: Column[] = [
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true, filterable: true },
    { key: 'price', label: 'Price', sortable: true }
  ] as Column[];

  data = [
    { name: 'Product A', category: 'Electronics', price: 299.99 },
    { name: 'Product B', category: 'Books', price: 24.99 },
    { name: 'Product C', category: 'Electronics', price: 399.99 },
    { name: 'Product D', category: 'homeAppliance', price: 199.99 },
    { name: 'Product E', category: 'Books', price: 49.99 },
    { name: 'Product F', category: 'Electronics', price: 349.99 },
    { name: 'Product G', category: 'homeAppliance', price: 129.99 },
  ];

  ngAfterViewInit() {
    // Assegna il template personalizzato dopo che la view è stata inizializzata
    if (this.priceTemplate) {
      this.columns[2].cellTemplate = this.priceTemplate;
    }
  }
}
