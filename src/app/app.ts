import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MedicamentList } from "./components/medicament-list/medicament-list";
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HttpClientModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pharma_track');
}
