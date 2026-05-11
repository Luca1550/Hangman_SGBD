import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'hangman-app';
  
  // On injecte notre service de base de données
  dbService = inject(DatabaseService);

  // ngOnInit se lance automatiquement au démarrage du composant
  ngOnInit() {
    this.dbService.loadCategories();
  }
}
