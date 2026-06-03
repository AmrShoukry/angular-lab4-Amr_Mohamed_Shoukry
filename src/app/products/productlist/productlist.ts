import { Component, signal } from '@angular/core';
import type { Product } from '../product';
import type { Category } from '../category';
import { ProductsFilter } from '../products-filter/products-filter';
import { ProductsFilterPipe } from '../products-filter-pipe';

@Component({
  selector: 'app-productlist',
  imports: [ProductsFilter, ProductsFilterPipe],
  templateUrl: './productlist.html',
  styleUrl: './productlist.css',
})
export class Productlist {
  products = signal<Product[]>([
    {
      id: 1,
      name: 'iPhone 15',
      imgUrl: 'https://picsum.photos/300/300?random=1',
      price: 999,
      quantity: 15,
      catId: 1,
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      imgUrl: 'https://picsum.photos/300/300?random=2',
      price: 899,
      quantity: 12,
      catId: 1,
    },
    {
      id: 3,
      name: 'Men T-Shirt',
      imgUrl: 'https://picsum.photos/300/300?random=3',
      price: 25,
      quantity: 50,
      catId: 2,
    },
    {
      id: 4,
      name: 'Women Hoodie',
      imgUrl: 'https://picsum.photos/300/300?random=4',
      price: 45,
      quantity: 30,
      catId: 2,
    },
    {
      id: 5,
      name: 'Clean Code',
      imgUrl: 'https://picsum.photos/300/300?random=5',
      price: 35,
      quantity: 20,
      catId: 3,
    },
    {
      id: 6,
      name: 'Atomic Habits',
      imgUrl: 'https://picsum.photos/300/300?random=6',
      price: 20,
      quantity: 40,
      catId: 3,
    },
    {
      id: 7,
      name: 'Coffee Maker',
      imgUrl: 'https://picsum.photos/300/300?random=7',
      price: 120,
      quantity: 10,
      catId: 4,
    },
    {
      id: 8,
      name: 'Air Fryer',
      imgUrl: 'https://picsum.photos/300/300?random=8',
      price: 150,
      quantity: 8,
      catId: 4,
    },
    {
      id: 9,
      name: 'Football',
      imgUrl: 'https://picsum.photos/300/300?random=9',
      price: 30,
      quantity: 25,
      catId: 5,
    },
    {
      id: 10,
      name: 'Dumbbell Set',
      imgUrl: 'https://picsum.photos/300/300?random=10',
      price: 80,
      quantity: 18,
      catId: 5,
    },
  ]);
  categories = signal<Category[]>([
    {
      id: 1,
      name: 'Electronics',
    },
    {
      id: 2,
      name: 'Clothing',
    },
    {
      id: 3,
      name: 'Books',
    },
    {
      id: 4,
      name: 'Home & Kitchen',
    },
    {
      id: 5,
      name: 'Sports',
    },
  ]);
  selectedCategoryId = signal<number>(0);
  totalPrice = signal<number>(0);

  changeCategory(categoryId: number) {
    this.selectedCategoryId.set(categoryId);
  }

  buyProduct(product: Product, quantity: string) {
    const quantityN = Number(quantity);
    if (quantityN > product.quantity) {
      alert('Not enough stock available!');
      return;
    }
    product.quantity -= quantityN;
    this.totalPrice.update((price) => price + product.price * quantityN);
  }
}
