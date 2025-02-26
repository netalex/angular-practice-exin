import { TemplateRef } from "@angular/core";

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  cellTemplate?: TemplateRef<any>; // Per personalizzazione celle
}

