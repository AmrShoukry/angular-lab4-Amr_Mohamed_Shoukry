import { Pipe, type PipeTransform } from '@angular/core';
import type { Product } from './product';

@Pipe({
  name: 'productsFilter',
})
export class ProductsFilterPipe implements PipeTransform {
  transform(value: Product[], categoryId: number): Product[] {
    if (categoryId === 0) {
      return value;
    }
    return value.filter((product) => product.catId === categoryId);
  }
}
