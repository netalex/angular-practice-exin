import { Component } from '@angular/core';
import { DataGridComponent } from './features/data-grid/data-grid.component';


@Component({
  selector: 'app-root',
  imports: [DataGridComponent],
  template: `
    <h1>{{title}}</h1>
    <h2>Data Grid Component</h2>
    <app-data-grid [columns]="columns" [data]="data"></app-data-grid>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-practice-exin';
  columns = [
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true, filterable: true },
    { key: 'price', label: 'Price', sortable: true }
  ];

  data = [
    { name: 'Product A', category: 'Electronics', price: 299.99 },
    { name: 'Product B', category: 'Books', price: 24.99 },
    { name: 'Product C', category: 'Electronics', price: 399.99 },
    { name: 'Product D', category: 'homeAppliance', price: 199.99 }
  ];

}
