import type { Routes } from '@angular/router';
import { Studentlist } from './students/studentlist/studentlist';
import { Productlist } from './products/productlist/productlist';
import { Contact } from './contact/contact/contact';
import { About } from './about/about/about';

export const routes: Routes = [
  { path: 'home', component: Studentlist },
  { path: 'products', component: Productlist },
  { path: 'contact', component: Contact },
  { path: 'about', component: About },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
