import type { Routes } from '@angular/router';
import { Studentlist } from './students/studentlist/studentlist';

export const routes: Routes = [
  { path: 'home', component: Studentlist },
  {
    path: 'products',
    loadComponent: () => import('./products/productlist/productlist').then((m) => m.Productlist),
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact/contact').then((m) => m.Contact),
  },
  { path: 'about', loadComponent: () => import('./about/about/about').then((m) => m.About) },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
