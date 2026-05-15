import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { GameBoardComponent } from '../../components/game-board.component';
import { KeyboardComponent } from '../../components/keyboard.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [GameBoardComponent, KeyboardComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GamePageComponent {
  dbService = inject(DatabaseService);
  router = inject(Router);

  onStartGame() {
    this.dbService.startNewGame();
  }

  onPlayLetter(letter: string) {
    this.dbService.playLetter(letter);
  }

  goHome() {
    // On nettoie la session de jeu avant de partir
    this.dbService.currentWord.set(null);
    this.dbService.guessedLetters.set([]);
    this.dbService.currentUser.set(null);
    this.dbService.newAchievements.set([]);
    this.router.navigate(['/']);
  }

  goHistory() {
    this.router.navigate(['/history']);
  }
}
