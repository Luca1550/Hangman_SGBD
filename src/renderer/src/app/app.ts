import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DatabaseService } from './services/database.service';
import { KeyboardComponent } from './components/keyboard.component';
import { GameBoardComponent } from './components/game-board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, KeyboardComponent, GameBoardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'hangman-app';
  
  // On injecte notre service de base de données
  dbService = inject(DatabaseService);

  // ngOnInit se lance automatiquement au démarrage du composant
  ngOnInit() {
    this.dbService.loadCategories();
  }

  // Fonction appelée par le clic sur le bouton dans le HTML
  onStartGame() {
    this.dbService.startNewGame();
  }

  // Fonction appelée par le clic sur une lettre du clavier
  onPlayLetter(letter: string) {
    this.dbService.playLetter(letter);
  }
}