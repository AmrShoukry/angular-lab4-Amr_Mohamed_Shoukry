import { Component, input, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Category } from '../category';

@Component({
  selector: 'app-products-filter',
  imports: [FormsModule],
  templateUrl: './products-filter.html',
  styleUrl: './products-filter.css',
})
export class ProductsFilter {
  totalPrice = input.required<number>();
  categories = input.required<Category[]>();
  selectedCategoryId = input.required<number>();
  selectedCategoryIdChange = output<number>();

  changeCategory(categoryId: string) {
    this.selectedCategoryIdChange.emit(Number(categoryId));
  }
}
