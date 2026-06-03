import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Studentlist } from './students/studentlist/studentlist';
import { Productlist } from './products/productlist/productlist';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Studentlist, Productlist, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('lab3');
}
